'use client';

import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from '$lib/redux';
import { increment, decrement, reset, incrementBy, decrementBy } from '$lib/redux/counter';

import styles from './page.module.scss';

export default function Wheel() {
    // const [transformDeg, setTransformDeg] = useState(0);
    // const colors = ['#ffffff80', '#ffcf9033'] as const;
    // const choices = new Array(6).fill(null).map((_, index) => index);
    // const segments = choices.map((e) => ({
    //     name: e,
    //     ratio: 1
    // }));

    // type Segment = {
    //     color: string;
    //     offset: number;
    //     offsetEnd: number;
    // };
    // let spanned = 0;
    // let isSpinning: false | (Segment) = false;
    // let spinResult: null | (Segment) = null;

    // const minSpin = 8;
    // const max = segments.reduce((sum, segment) => sum + segment.ratio, 0);
    // const conics = segments.map((segment, i) => {
    //     const breadth = 360 / max * segment.ratio;
    //     const offset = spanned;
    //     const offsetEnd = spanned + breadth;

    //     spanned += breadth;

    //     // return `${colors[i % 2]} ${offset}deg ${offsetEnd}deg`;

    //     return {
    //         ...segment,
    //         color: colors[i % 2],
    //         offset,
    //         offsetEnd
    //     };
    // });


    // function getConicGradient() {
    //     return conics
    //         .map(({ color, offset, offsetEnd }) => `${color} ${offset}deg ${offsetEnd}deg`)
    //         .join(', ');
    // }

    // function onTransitionEnd(e) {
    //     const { currentTarget } = e;

    //     if (!(currentTarget instanceof HTMLElement)) return;

    //     spinResult = isSpinning as Segment;
    //     isSpinning = false;
    // }

    // function spin() {
    //     // setTransformDeg((deg) => deg % 360);

    //     if (isSpinning) return;

    //     const result = Math.floor(Math.random() * choices.length);

    //     const segment = conics[result];

    //     if (!segment) return;

    //     const offset = Math.floor(Math.random() * (segment.offsetEnd - segment.offset + 1));

    //     setTransformDeg((deg) => deg + 360 * minSpin + (360 - segment.offset) - offset + 90);
    //     isSpinning = segment as Segment;
    // }

    return (
        <div className={styles.account}>
            Todo: User account
        </div>

    // <div className={styles.spinArea}>
    //     <div className={styles.wheelArea}>
    //         <div className={styles.wheelWrapper}>
    //             <div
    //                 className={styles.wheel}
    //                 style={{
    //                     transform: `rotate(${transformDeg}deg)`,
    //                     background: `conic-gradient(${getConicGradient()})`
    //                 }}
    //                 onTransitionEnd={onTransitionEnd}
    //             >
    //                 {conics.map((segment, index) => {
    //                     const deg = segment.offset + (segment.offsetEnd - segment.offset) / 2;

    //                     return (
    //                         <div
    //                             key={index}
    //                             className={styles.wheelItem}
    //                             style={{
    //                                 transform: `rotate(${deg}deg)`
    //                             }}
    //                         >
    //                             {segment.name}
    //                         </div>
    //                     );
    //                 })}
    //             </div>
    //             <button className={styles.spinButton} onClick={spin}>
    //                 Spin!
    //             </button>
    //         </div>
    //     </div>
    // </div>
    );
}