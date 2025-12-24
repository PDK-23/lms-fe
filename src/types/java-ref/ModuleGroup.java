package com.example.lms.systems.module.entity;

import com.example.lms.systems.user.entity.User;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * A logical grouping of modules for menu or feature organization.
 */
@Entity
@Table(name = "module_groups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ToString(onlyExplicitlyIncluded = true)
public class ModuleGroup {

    /**
     * Primary key
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @ToString.Include
    private Long id;

    /**
     * Unique name of the group
     */
    @NotBlank(message = "Group name is mandatory")
    @Column(name = "group_name", nullable = false, length = 255)
    @ToString.Include
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "icon", length = 255, nullable = false)
    private String icon;

    @Column(name = "url", length = 255, nullable = false)
    private String url;

    /**
     * Modules contained in this group
     */
    @OneToMany(
            mappedBy = "moduleGroup",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    @JsonManagedReference
    @Builder.Default
    private List<Module> modules = new ArrayList<>();

    /**
     * Who created this group
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "created_by_id",           // tên cột FK trong bảng này
            referencedColumnName = "id",  // (tùy chọn) PK của Course, default là "id"
            nullable = false,
            updatable = false
    )
    private User createdBy;

    /**
     * When it was created
     */
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Who last updated this group
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "updated_by_id",           // tên cột FK trong bảng này
            referencedColumnName = "id",  // (tùy chọn) PK của Course, default là "id"
            nullable = false              // tùy chỉnh nullability
    )
    private User updatedBy;

    /**
     * When it was last updated
     */
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
