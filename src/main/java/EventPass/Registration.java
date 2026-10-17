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
    private String role;
    private String studentId;
    private String badgeCode;
    private boolean checkedIn = false;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

    public Registration() {
    }

    public Registration(String fullName, String email, String role, String studentId, Event event) {
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.studentId = studentId;
        this.event = event;
        this.checkedIn = false;
        this.badgeCode = "UIT-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
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

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getBadgeCode() {
        return badgeCode;
    }

    public void setBadgeCode(String badgeCode) {
        this.badgeCode = badgeCode;
    }

    public boolean isCheckedIn() {
        return checkedIn;
    }

    public void setCheckedIn(boolean checkedIn) {
        this.checkedIn = checkedIn;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }
}