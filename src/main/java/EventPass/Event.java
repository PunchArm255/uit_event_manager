package EventPass;

import jakarta.persistence.*;

@Entity
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Auto-incrementing Primary Key (1, 2, 3...)

    private String title;
    private String date;
    private String location;
    private String category;
    private int capacity;
    private String color;

    // Empty constructor required by JPA
    public Event() {
    }

    public Event(String title, String date, String location, String category, int capacity) {
        this(title, date, location, category, capacity, "blue");
    }

    public Event(String title, String date, String location, String category, int capacity, String color) {
        this.title = title;
        this.date = date;
        this.location = location;
        this.category = category;
        this.capacity = capacity;
        this.color = (color == null || color.isBlank()) ? "blue" : color;
    }

    // Getters and Setters (Java requires these to convert your object to JSON)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}