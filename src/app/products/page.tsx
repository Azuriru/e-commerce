'use client';

import { type MouseEventHandler } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Icon, Divider } from '$lib/components';

import { copy } from '$lib/util/array';
import { capitalize } from '$lib/util/string';
import { add } from '$lib/redux/cart';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import classNames from 'classnames';

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
    const [filterShown, setFilterShown] = useState(false);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState<'alphabetical' | 'alphabetical-reversed' | 'price' | 'price-reversed'>('alphabetical');
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

    const onSearch = (e) => {
        setSearch(e.target.value);
    };

    useEffect(() => {
        const categories = Object.keys(filter).filter((category) => filter[category]);

        const filtered = copy(availableProducts).filter(({ name, category }) => {
            return name.includes(search.toLowerCase()) && (!categories.length || category.some((c) => categories.includes(c)));
        });

        filtered.sort((a, b) => {
            if (sort === 'price') return a.price - b.price;
            if (sort === 'price-reversed') return b.price - a.price;
            if (sort === 'alphabetical-reversed') return b.name.localeCompare(a.name);

            return a.name.localeCompare(b.name);
        });

        setProducts(filtered);
    }, [search, sort, filter]);

    return (
        <>
            <div className={styles.products}>
                <div className={styles.productHeader}>
                    <input
                        name="search"
                        type="text"
                        value={search}
                        className={styles.productSearch}
                        placeholder="Search for a product"
                        onInput={onSearch}
                    />
                    <div className={styles.productListOptions}>
                        <div className={styles.productListOption} onClick={() => sort === 'alphabetical' ? setSort('alphabetical-reversed') : setSort('alphabetical')}>
                            <Icon name="sort_by_alpha" />
                        </div>
                        <div className={styles.productListOption} onClick={() => sort === 'price' ? setSort('price-reversed') : setSort('price')}>
                            <Icon name="swap_vert" />
                        </div>
                        <div className={styles.productListOption} onClick={() => setFilterShown(true)}>
                            <Icon name="tune" />Filters
                        </div>
                        <div className={styles.productListOptionFilter}>
                            {
                                Object.keys(filter)
                                    .filter((key) => filter[key])
                                    .map((category) => {
                                        return (
                                            <div key={category} className={styles.productListOption} onClick={() => onFilter(category)}>
                                                <Icon name="close" /> {capitalize(category)}
                                            </div>
                                        );
                                    })
                            }
                        </div>
                    </div>
                </div>
                <div className={styles.productList}>
                    {
                        products.map((product) => <Product key={product.id} {...product} />)
                    }
                </div>
            </div>
            <div className={classNames(styles.productFiltersModal, filterShown && styles.shown)}>
                <div className={styles.productFiltersHeader}>
                    Search filters
                </div>
                <div className={styles.productFiltersList}>
                    {
                        categories.map((category) => {
                            return (
                                <div key={category} className={`${styles.category} ${filter[category] ? styles.active : ''}`} onClick={() => onFilter(category)}>
                                    {capitalize(category)}
                                </div>
                            );
                        })
                    }
                </div>
                <div className={styles.productFiltersControls}>
                    <div className={styles.productFiltersReset} onClick={() => setFilter({})}>Reset All</div>
                    <div className={styles.productFilterDone} onClick={() => setFilterShown(false)}>Done</div>
                </div>
            </div>
        </>
    );
}