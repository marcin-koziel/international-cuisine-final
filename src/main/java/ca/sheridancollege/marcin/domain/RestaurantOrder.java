package ca.sheridancollege.marcin.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A RestaurantOrder.
 */
@Entity
@Table(name = "restaurant_order")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class RestaurantOrder implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "total")
    private Float total;

    @JsonIgnoreProperties(value = { "restaurantOrder", "restaurantMenu" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private RestaurantItem item;

    @ManyToOne
    @JsonIgnoreProperties(value = { "restaurantOrders", "user" }, allowSetters = true)
    private Transaction transaction;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public RestaurantOrder id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getQuantity() {
        return this.quantity;
    }

    public RestaurantOrder quantity(Integer quantity) {
        this.setQuantity(quantity);
        return this;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Float getTotal() {
        return this.total;
    }

    public RestaurantOrder total(Float total) {
        this.setTotal(total);
        return this;
    }

    public void setTotal(Float total) {
        this.total = total;
    }

    public RestaurantItem getItem() {
        return this.item;
    }

    public void setItem(RestaurantItem restaurantItem) {
        this.item = restaurantItem;
    }

    public RestaurantOrder item(RestaurantItem restaurantItem) {
        this.setItem(restaurantItem);
        return this;
    }

    public Transaction getTransaction() {
        return this.transaction;
    }

    public void setTransaction(Transaction transaction) {
        this.transaction = transaction;
    }

    public RestaurantOrder transaction(Transaction transaction) {
        this.setTransaction(transaction);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RestaurantOrder)) {
            return false;
        }
        return id != null && id.equals(((RestaurantOrder) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "RestaurantOrder{" +
            "id=" + getId() +
            ", quantity=" + getQuantity() +
            ", total=" + getTotal() +
            "}";
    }
}
