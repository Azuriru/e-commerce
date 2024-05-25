import 'material-symbols';
import type { MaterialSymbol } from 'material-symbols';

export type MaterialSymbolProps = {
    type?: 'outlined' | 'rounded' | 'sharp';
    name: MaterialSymbol;
    size?: number;
};

export default function MaterialSymbol({ type = 'outlined', name, size }: MaterialSymbolProps) {
    const fontWeight = type === 'outlined' ? 300 : 'initial';
    const fontSize = size && size + 'px';

    return (
        <span
            className={`material-symbol material-symbols-${type}`}
            style={{
                fontSize,
                fontWeight
            }}
        >
            {name}
        </span>
    );
}