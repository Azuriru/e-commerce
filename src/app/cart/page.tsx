'use client';

import Link from 'next/link';
import Image from 'next/image';
import { type ChangeEvent, useEffect, useState, type Dispatch, type SetStateAction } from 'react';

import { useDispatch, useSelector } from '$lib/redux';
import { add, empty, modify, remove, subtract } from '$lib/redux/cart';
import { ObjectProperty } from '$lib/util/types';
import { capitalize } from '$lib/util/string';
import { Icon } from '$lib/components';

import styles from './page.module.scss';

import availableProducts, { allProducts, unavailableProducts } from '$lib/util/client/products';
import _products from '$lib/products.json'; // Product[]
import _sellers from '$lib/sellers.json'; // Record<ObjectProperty, Seller>

type CartSelectedState = Record<ObjectProperty, boolean>;

type CartItemProps = Product & {
    quantity: number;
    cartSelected: CartSelectedState;
    setCartSelected: Dispatch<SetStateAction<CartSelectedState>>;
};

type CartGroupProps = {
    id: string;
    products: CartItemProps[];
    cartSelected: CartSelectedState;
    setCartSelected: Dispatch<SetStateAction<CartSelectedState>>;
};

function getSeller(id: string) {
    return _sellers[id] ?? `Seller ${id}`;
}

function getProduct(productId: string) {
    return _products.find(({ id }) => id.toString() === productId) as Product;
}

function getProducts(cart: Cart): Record<string, CartItemProps[]> {
    return Object.entries(cart)
        .map(([id, quantity]) => ({
            ...getProduct(id),
            quantity
        }))
        .reduce((groups, product) => {
            const { seller } = product;
            if (!groups[seller]) {
                groups[seller] = [];
            }
            groups[seller].push(product);

            return groups;
        }, {});
}

function CartItem({ name, id, price, quantity, cartSelected, setCartSelected }: CartItemProps) {
    const dispatch = useDispatch();
    const onIncrement = () => dispatch(add({ id }));
    const onDecrement = () => dispatch(subtract({ id }));
    const onChange = (event: ChangeEvent<HTMLInputElement>) => dispatch(modify({ id, quantity: Number(event.target.value) }));
    const onItemSelect = (event: ChangeEvent<HTMLInputElement>) => setCartSelected((state) => {
        return {
            ...state,
            [id]: event.target.checked
        };
    });

    return (
        <div className={styles.cartItem}>
            <input type="checkbox" checked={cartSelected[id] ?? false} className={styles.cartItemSelected} onChange={onItemSelect} />
            <Link className={styles.cartItemImage} href={'products/' + id}>
                <Image
                    src={`/products/${name}.png`}
                    alt={name}
                    layout="fill"
                />
            </Link>
            <div className={styles.cartItemDetails}>
                <div className={styles.cartItemName}>
                    {name.split('-').map((part) => capitalize(part)).join(' ')}
                </div>
                <div className={styles.cartItemInfo}>
                    <div className={styles.cartItemPrice}>¥ {price}</div>
                    <div className={styles.cartItemControls}>
                        <div className={styles.cartItemSubtract} onClick={onDecrement}>
                            <Icon name="remove" />
                        </div>
                        <input className={styles.cartItemQuantity} type="number" value={quantity} onChange={onChange} />
                        <div className={styles.cartItemAdd} onClick={onIncrement}>
                            <Icon name="add" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CartGroup({ id, products, cartSelected, setCartSelected }: CartGroupProps) {
    const onGroupSelect = (event: ChangeEvent<HTMLInputElement>) => setCartSelected((state) => {
        const { ..._state } = state;

        for (const product of products) {
            _state[product.id] = event.target.checked;
        }

        return _state;
    });

    return (
        <div className={styles.cartGroup}>
            <div className={styles.cartGroupSeller}>
                <input type="checkbox" checked={products.every(({ id }) => cartSelected[id])} className={styles.cartGroupSelected} onChange={onGroupSelect} />
                <Icon name="storefront" />
                {capitalize(getSeller(id))}
            </div>
            <div className={styles.cartGroupProducts}>
                {
                    products.map((product) => <CartItem key={product.id} {...product} cartSelected={cartSelected} setCartSelected={setCartSelected} />)
                }
            </div>
        </div>
    );
}

export default function Cart() {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    const [cartSelected, setCartSelected] = useState<CartSelectedState>({});
    const [cartTotal, setCartTotal] = useState(0);
    const cartProducts = getProducts(cart);
    const onClick = () => dispatch(empty());

    useEffect(() => {
        const total = Object.values(cartProducts).flat().reduce((total, product) => {
            if (cartSelected[product.id]) {
                return total + product.price * product.quantity;
            }

            return total;
        }, 0);
        setCartTotal(total);
    }, [cartProducts, cartSelected]);

    return (
        <div className={styles.cart}>
            <div className={styles.cartHeader}>Cart</div>
            <div className={styles.cartGroups}>
                {
                    Object.entries(cartProducts).map(([id, products]) => {
                        return (
                            <CartGroup
                                key={id}
                                id={id}
                                products={products}
                                cartSelected={cartSelected}
                                setCartSelected={setCartSelected}
                            />
                        );
                    })
                }
            </div>
            <div className={styles.cartCheckoutHeader}>
                <div className={styles.cartEmpty} onClick={onClick}>Clear All</div>
                <div className={styles.cartTotal}>Total: {cartTotal}</div>
            </div>
        </div>
    );
}