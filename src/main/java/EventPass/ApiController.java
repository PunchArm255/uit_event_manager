package EventPass;

import jakarta.annotation.PostConstruct;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ApiController {

    private final EventRepository eventRepo;
    private final RegistrationRepository regRepo;
    private final UserRepository userRepo;

    public ApiController(EventRepository eventRepo, RegistrationRepository regRepo, UserRepository userRepo) {
        this.eventRepo = eventRepo;
        this.regRepo = regRepo;
        this.userRepo = userRepo;
    }

    @PostConstruct
    public void seedData() {
        if (userRepo.count() == 0) {
            userRepo.save(new User(
                    "Pr. Admin UIT (Département Info)",
                    "admin@uit.ac.ma",
                    "admin123",
                    "ADMIN",
                    "ADMIN-FSK"));
            userRepo.save(new User(
                    "Mohammed Nassiri",
                    "mohammed.nassiri@uit.ac.ma",
                    "student123",
                    "STUDENT",
                    "M-CLOUD-2026"));
        }

        if (eventRepo.count() == 0) {
            Event e1 = eventRepo.save(new Event(
                    "Journée Cloud Native, Kubernetes & Microservices",
                    "24 Nov 2026 • 09:00",
                    "Amphi Central — Faculté des Sciences, Kénitra",
                    "MASTER CLOUD & J2EE",
                    120));
            Event e2 = eventRepo.save(new Event(
                    "Séminaire IA Générative & Architectures Distribuées",
                    "02 Déc 2026 • 14:30",
                    "Centre de Conférences — Université Ibn Tofaïl",
                    "RECHERCHE & IA",
                    80));
            Event e3 = eventRepo.save(new Event(
                    "Forum Entreprises, Cloud & Stages PFE 2026",
                    "15 Déc 2026 • 09:30",
                    "Hall Principal — Campus Universitaire UIT Kénitra",
                    "CARRIÈRE & PFE",
                    250));
            Event e4 = eventRepo.save(new Event(
                    "Workshop DevSecOps & Automatisation CI/CD",
                    "22 Déc 2026 • 10:00",
                    "Salle TP B4 — Département d'Informatique",
                    "WORKSHOP PRATIQUE",
                    40));

            regRepo.save(new Registration("Mohammed Nassiri", "mohammed.nassiri@uit.ac.ma", "Master Cloud Engineering",
                    "M-CLOUD-2026", e1));
            regRepo.save(new Registration("Yassine Esserdaoui", "yassine.e@uit.ac.ma", "Master Cloud Engineering",
                    "M-CLOUD-2029", e1));
            regRepo.save(new Registration("Salma El Amrani", "salma.elamrani@uit.ac.ma", "Doctorante Labo Info",
                    "DOC-UIT-104", e2));
        }
    }

    // --- AUTHENTICATION ENDPOINTS ---

    @PostMapping("/auth/login")
    public User login(@RequestBody User credentials) {
        User user = userRepo.findByEmailIgnoreCase(credentials.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Identifiants introuvables"));
        if (!user.getPassword().equals(credentials.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Mot de passe incorrect");
        }
        return user;
    }

    @PostMapping("/auth/signup")
    public User signup(@RequestBody User newUser) {
        if (userRepo.findByEmailIgnoreCase(newUser.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cet email UIT est déjà inscrit");
        }
        newUser.setRole("STUDENT");
        if (newUser.getStudentId() == null || newUser.getStudentId().isBlank()) {
            newUser.setStudentId("ETU-" + (1000 + userRepo.count()));
        }
        return userRepo.save(newUser);
    }

    // --- EVENTS ENDPOINTS ---

    @GetMapping("/events")
    public List<Event> getAllEvents() {
        return eventRepo.findAll();
    }

    @PostMapping("/events")
    public Event createEvent(@RequestBody Event event) {
        return eventRepo.save(event);
    }

    @DeleteMapping("/events/{id}")
    public void deleteEvent(@PathVariable Long id) {
        List<Registration> regs = regRepo.findByEventId(id);
        regRepo.deleteAll(regs);
        eventRepo.deleteById(id);
    }

    // --- REGISTRATIONS & BADGES ENDPOINTS ---

    @GetMapping("/registrations")
    public List<Registration> getRegistrations(
            @RequestParam(required = false) Long eventId,
            @RequestParam(required = false) String email) {
        if (email != null && !email.isBlank()) {
            return regRepo.findByEmailIgnoreCase(email);
        }
        if (eventId != null) {
            return regRepo.findByEventId(eventId);
        }
        return regRepo.findAll();
    }

    @PostMapping("/events/{eventId}/register")
    public Registration register(@PathVariable Long eventId, @RequestBody Registration req) {
        Event event = eventRepo.findById(eventId).orElseThrow();

        // Check if student is already registered for this event
        var existing = regRepo.findByEventIdAndEmailIgnoreCase(eventId, req.getEmail());
        if (existing.isPresent()) {
            return existing.get(); // Return their existing badge seamlessly
        }

        String role = (req.getRole() == null || req.getRole().isBlank()) ? "Master Cloud Engineering" : req.getRole();
        String studentId = (req.getStudentId() == null || req.getStudentId().isBlank()) ? "UIT-ETU"
                : req.getStudentId();

        Registration newBadge = new Registration(req.getFullName(), req.getEmail(), role, studentId, event);
        return regRepo.save(newBadge);
    }

    // Admin QR Code / Badge Verification & Check-In
    @PostMapping("/badges/verify/{badgeCode}")
    public Registration verifyAndCheckIn(@PathVariable String badgeCode) {
        Registration reg = regRepo.findByBadgeCodeIgnoreCase(badgeCode.trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Badge invalide ou introuvable"));
        reg.setCheckedIn(true);
        return regRepo.save(reg);
    }
}