package ca.sheridancollege.marcin.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A RestaurantMenu.
 */
@Entity
@Table(name = "restaurant_menu")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class RestaurantMenu implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "title")
    private String title;

    @OneToMany(mappedBy = "restaurantMenu")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "restaurantOrder", "restaurantMenu" }, allowSetters = true)
    private Set<RestaurantItem> items = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public RestaurantMenu id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public RestaurantMenu title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Set<RestaurantItem> getItems() {
        return this.items;
    }

    public void setItems(Set<RestaurantItem> restaurantItems) {
        if (this.items != null) {
            this.items.forEach(i -> i.setRestaurantMenu(null));
        }
        if (restaurantItems != null) {
            restaurantItems.forEach(i -> i.setRestaurantMenu(this));
        }
        this.items = restaurantItems;
    }

    public RestaurantMenu items(Set<RestaurantItem> restaurantItems) {
        this.setItems(restaurantItems);
        return this;
    }

    public RestaurantMenu addItem(RestaurantItem restaurantItem) {
        this.items.add(restaurantItem);
        restaurantItem.setRestaurantMenu(this);
        return this;
    }

    public RestaurantMenu removeItem(RestaurantItem restaurantItem) {
        this.items.remove(restaurantItem);
        restaurantItem.setRestaurantMenu(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RestaurantMenu)) {
            return false;
        }
        return id != null && id.equals(((RestaurantMenu) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "RestaurantMenu{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            "}";
    }
}
