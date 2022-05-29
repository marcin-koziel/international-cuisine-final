package ca.sheridancollege.marcin.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Transaction.
 */
@Entity
@Table(name = "transaction")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Transaction implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "sub_total")
    private Float subTotal;

    @Column(name = "tax")
    private Float tax;

    @Column(name = "total")
    private Float total;

    @Column(name = "last_four_digits")
    private String lastFourDigits;

    @OneToMany(mappedBy = "transaction")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "item", "transaction" }, allowSetters = true)
    private Set<RestaurantOrder> restaurantOrders = new HashSet<>();

    @ManyToOne
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Transaction id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Float getSubTotal() {
        return this.subTotal;
    }

    public Transaction subTotal(Float subTotal) {
        this.setSubTotal(subTotal);
        return this;
    }

    public void setSubTotal(Float subTotal) {
        this.subTotal = subTotal;
    }

    public Float getTax() {
        return this.tax;
    }

    public Transaction tax(Float tax) {
        this.setTax(tax);
        return this;
    }

    public void setTax(Float tax) {
        this.tax = tax;
    }

    public Float getTotal() {
        return this.total;
    }

    public Transaction total(Float total) {
        this.setTotal(total);
        return this;
    }

    public void setTotal(Float total) {
        this.total = total;
    }

    public String getLastFourDigits() {
        return this.lastFourDigits;
    }

    public Transaction lastFourDigits(String lastFourDigits) {
        this.setLastFourDigits(lastFourDigits);
        return this;
    }

    public void setLastFourDigits(String lastFourDigits) {
        this.lastFourDigits = lastFourDigits;
    }

    public Set<RestaurantOrder> getRestaurantOrders() {
        return this.restaurantOrders;
    }

    public void setRestaurantOrders(Set<RestaurantOrder> restaurantOrders) {
        if (this.restaurantOrders != null) {
            this.restaurantOrders.forEach(i -> i.setTransaction(null));
        }
        if (restaurantOrders != null) {
            restaurantOrders.forEach(i -> i.setTransaction(this));
        }
        this.restaurantOrders = restaurantOrders;
    }

    public Transaction restaurantOrders(Set<RestaurantOrder> restaurantOrders) {
        this.setRestaurantOrders(restaurantOrders);
        return this;
    }

    public Transaction addRestaurantOrder(RestaurantOrder restaurantOrder) {
        this.restaurantOrders.add(restaurantOrder);
        restaurantOrder.setTransaction(this);
        return this;
    }

    public Transaction removeRestaurantOrder(RestaurantOrder restaurantOrder) {
        this.restaurantOrders.remove(restaurantOrder);
        restaurantOrder.setTransaction(null);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Transaction user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Transaction)) {
            return false;
        }
        return id != null && id.equals(((Transaction) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Transaction{" +
            "id=" + getId() +
            ", subTotal=" + getSubTotal() +
            ", tax=" + getTax() +
            ", total=" + getTotal() +
            ", lastFourDigits='" + getLastFourDigits() + "'" +
            "}";
    }
}
