package EventPass;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String email;
    private String role; // e.g., "VIP", "Speaker", "Attendee"
    private String badgeCode;

    // Foreign Key: Links many Registrations to one Event
    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

    public Registration() {
    }

    public Registration(String fullName, String email, String role, Event event) {
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.event = event;
        // Automatically generate a unique 6-character cryptographic badge ID
        this.badgeCode = "PASS-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getBadgeCode() {
        return badgeCode;
    }

    public void setBadgeCode(String badgeCode) {
        this.badgeCode = badgeCode;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }
}