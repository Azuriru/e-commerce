'use client';

import { MouseEventHandler } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Icon, Divider } from '$lib/components';

import { copy } from '$lib/util/array';
import { capitalize } from '$lib/util/string';
import { add } from '$lib/redux/cart';
import { useDispatch } from 'react-redux';

import { useState, useEffect } from 'react';

import availableProducts from '$lib/util/client/products';

import styles from './page.module.scss';

function Product({ name, price, id }: Product) {
    const dispatch = useDispatch();

    const onAdd: MouseEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        dispatch(add({ id }));
    };

    return (
        <Link className={styles.product} href={'products/' + id}>
            <Image
                className={styles.productImage}
                src={`/products/${name}.png`}
                alt={name}
                width={200}
                height={200}
            />
            <div className={styles.productToolbar}>
                <div className={styles.productInfo}>
                    <div className={styles.productName}>{name.split('-').map((part) => capitalize(part)).join(' ')}</div>
                    <div className="product-price">¥ {price}</div>
                </div>
                <div className={styles.productCart} onClick={onAdd}>
                    <Icon name="add_shopping_cart" />
                </div>
            </div>
        </Link>
    );
}

export default function Home() {
    const [products, setProducts] = useState(availableProducts);
    const [filter, setFilter] = useState({});
    const [sort, setSort] = useState<'alphabetical' | 'price' | 'price-reversed'>('alphabetical');
    const categories: string[] = availableProducts.reduce((categories, current) => {
        for (const category of current.category) {
            if (!categories.includes(category)) {
                categories.push(category);
            }
        }

        return categories;
    }, [] as string[]);

    const onFilter = (category: string) => {
        setFilter((filter) => ({
            ...filter,
            [category]: !filter[category]
        }));
    };

    useEffect(() => {
        const sorted = copy(availableProducts).sort((a, b) => {
            if (sort === 'price') return a.price - b.price;
            if (sort === 'price-reversed') return b.price - a.price;

            return a.name.localeCompare(b.name);
        });

        const categories = Object.keys(filter).filter((category) => filter[category]);

        if (!categories.length) {
            return setProducts(sorted);
        }

        const filteredProducts = sorted.filter(({ category }) => {
            return category.some((c) => categories.includes(c));
        });

        setProducts(filteredProducts);
    }, [sort, filter]);

    return (
        <div className={styles.products}>
            <div className={styles.sortBy}>
                <div className={styles.sort} onClick={() => setSort('alphabetical')}>Alphabetical</div>
                <Divider vr={true} />
                <div className={styles.sort} onClick={() => setSort('price')}>Price</div>
            </div>
            <div className={styles.filterBy}>
                {
                    categories.map((category) => {
                        return <div key={category} className={`${styles.category} ${filter[category] ? styles.active : ''}`} onClick={() => onFilter(category)}>{capitalize(category)}</div>;
                    })
                }
                <div className={styles.category} onClick={() => setFilter({})}>Reset All</div>
            </div>
            <div className={styles.productList}>
                {
                    products.map((product) => <Product key={product.id} {...product} />)
                }
            </div>
        </div>
    );
}