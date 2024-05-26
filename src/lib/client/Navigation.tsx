'use client';
import type { MaterialSymbol } from 'material-symbols';

import Link from 'next/link';
import { Icon } from '$lib/components';
import { capitalize } from '$lib/util/string';
import { useSelector } from '$lib/redux';

import styles from './Navigation.module.scss';

type OptionProps = {
    icon: MaterialSymbol;
    name: string;
};
const options: OptionProps[] = [
    {
        icon: 'shopping_bag',
        name: 'products'
    },
    {
        icon: 'shopping_cart',
        name: 'cart'
    },
    {
        icon: 'account_circle',
        name: 'account'
    }
] as const;

export default function Navigation() {
    const cart = useSelector((state) => state.cart);
    const items = Object.values(cart ?? {}).reduce((current, accumulator) => current + accumulator, 0);

    return (
        <nav className={styles.navigation}>
            {
                options.map(({ icon, name }: OptionProps) => {
                    return (
                        <Link key={name} href={`/${name}`} className={styles.navigationOption}>
                            <Icon name={icon} size={26} />
                            {
                                name === 'cart' && items > 0 && <div className={styles.cartItems}>{items}</div>
                            }
                            <span className={styles.navigationOptionText}>{capitalize(name)}</span>
                        </Link>
                    );
                })
            }
        </nav>
    );
}