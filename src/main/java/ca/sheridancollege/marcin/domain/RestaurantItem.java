package ca.sheridancollege.marcin.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A RestaurantItem.
 */
@Entity
@Table(name = "restaurant_item")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class RestaurantItem implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "summary")
    private String summary;

    @Column(name = "price")
    private Float price;

    @Column(name = "item_discount")
    private Float itemDiscount;

    @JsonIgnoreProperties(value = { "item", "transaction" }, allowSetters = true)
    @OneToOne(mappedBy = "item")
    private RestaurantOrder restaurantOrder;

    @ManyToOne
    @JsonIgnoreProperties(value = { "items" }, allowSetters = true)
    private RestaurantMenu restaurantMenu;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public RestaurantItem id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public RestaurantItem title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSummary() {
        return this.summary;
    }

    public RestaurantItem summary(String summary) {
        this.setSummary(summary);
        return this;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public Float getPrice() {
        return this.price;
    }

    public RestaurantItem price(Float price) {
        this.setPrice(price);
        return this;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

    public Float getItemDiscount() {
        return this.itemDiscount;
    }

    public RestaurantItem itemDiscount(Float itemDiscount) {
        this.setItemDiscount(itemDiscount);
        return this;
    }

    public void setItemDiscount(Float itemDiscount) {
        this.itemDiscount = itemDiscount;
    }

    public RestaurantOrder getRestaurantOrder() {
        return this.restaurantOrder;
    }

    public void setRestaurantOrder(RestaurantOrder restaurantOrder) {
        if (this.restaurantOrder != null) {
            this.restaurantOrder.setItem(null);
        }
        if (restaurantOrder != null) {
            restaurantOrder.setItem(this);
        }
        this.restaurantOrder = restaurantOrder;
    }

    public RestaurantItem restaurantOrder(RestaurantOrder restaurantOrder) {
        this.setRestaurantOrder(restaurantOrder);
        return this;
    }

    public RestaurantMenu getRestaurantMenu() {
        return this.restaurantMenu;
    }

    public void setRestaurantMenu(RestaurantMenu restaurantMenu) {
        this.restaurantMenu = restaurantMenu;
    }

    public RestaurantItem restaurantMenu(RestaurantMenu restaurantMenu) {
        this.setRestaurantMenu(restaurantMenu);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RestaurantItem)) {
            return false;
        }
        return id != null && id.equals(((RestaurantItem) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "RestaurantItem{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", summary='" + getSummary() + "'" +
            ", price=" + getPrice() +
            ", itemDiscount=" + getItemDiscount() +
            "}";
    }
}
