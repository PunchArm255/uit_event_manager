package EventPass;

import jakarta.annotation.PostConstruct;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ApiController {

    private final EventRepository eventRepo;
    private final RegistrationRepository regRepo;

    // Dependency Injection: Spring automatically hands us the database repositories
    public ApiController(EventRepository eventRepo, RegistrationRepository regRepo) {
        this.eventRepo = eventRepo;
        this.regRepo = regRepo;
    }

    // Runs automatically on startup: seeds initial data if the database is empty
    @PostConstruct
    public void seedData() {
        if (eventRepo.count() == 0) {
            Event e1 = eventRepo.save(new Event("Cloud Native & Kubernetes Summit", "2026-11-14 • 09:00",
                    "UM6P Congress Center, Benguerir", "INFRASTRUCTURE", 150));
            Event e2 = eventRepo.save(new Event("AI Systems & Vector DB Workshop", "2026-11-28 • 14:30",
                    "Technopark Auditorium, Rabat", "AI / ML", 80));
            Event e3 = eventRepo.save(new Event("Zero-Trust Security Architecture", "2026-12-05 • 10:00",
                    "Remote / Live Stream", "SECURITY", 300));

            regRepo.save(new Registration("Amine El Idrissi", "amine@cloud.ma", "VIP Speaker", e1));
            regRepo.save(new Registration("Sarah Benali", "sarah.b@dev.io", "Cloud Architect", e1));
        }
    }

    // 1. Get all events
    @GetMapping("/events")
    public List<Event> getAllEvents() {
        return eventRepo.findAll();
    }

    // 2. Create a new event
    @PostMapping("/events")
    public Event createEvent(@RequestBody Event event) {
        return eventRepo.save(event);
    }

    // 3. Delete an event
    @DeleteMapping("/events/{id}")
    public void deleteEvent(@PathVariable Long id) {
        List<Registration> regs = regRepo.findByEventId(id);
        regRepo.deleteAll(regs);
        eventRepo.deleteById(id);
    }

    // 4. Get all registered badges (or filter by event)
    @GetMapping("/registrations")
    public List<Registration> getRegistrations(@RequestParam(required = false) Long eventId) {
        if (eventId != null) {
            return regRepo.findByEventId(eventId);
        }
        return regRepo.findAll();
    }

    // 5. Register a participant and generate their badge
    @PostMapping("/events/{eventId}/register")
    public Registration register(@PathVariable Long eventId, @RequestBody Registration req) {
        Event event = eventRepo.findById(eventId).orElseThrow();
        Registration newBadge = new Registration(req.getFullName(), req.getEmail(), req.getRole(), event);
        return regRepo.save(newBadge);
    }
}