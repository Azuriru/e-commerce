import type { Booleanish } from '$lib/util/types';

export type DividerProps = {
    vr?: Booleanish;
    spacing?: number;
    size?: number;
    color?: string;
};
export default function Divider({
    vr = false,
    spacing = 6,
    size = 2,
    color = 'black'
}: DividerProps) {
    const width = vr ? size : '100%';
    const height = vr ? '100%' : size;
    const margin = vr ? '0' + spacing : spacing + '0';

    return (
        <div
            className="divider"
            style={{
                display: 'flex',
                flexShrink: 0,
                backgroundColor: color,
                width,
                height,
                margin
            }}
        />
    );
}