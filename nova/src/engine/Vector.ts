import * as t from "io-ts";
import { Stateful, StateIndexer, RecursivePartial, PartialState } from "./Stateful";
import { VectorState, AngleState } from "./VectorState";
import { isEmptyObject } from "./EmptyObject";

const TWO_PI = 2 * Math.PI;
class Vector implements Stateful<VectorState>, VectorLike {

    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static fromVectorLike(v: VectorLike) {
        return new Vector(v.x, v.y);
    }

    add(other: VectorLike) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    static minus(a: VectorLike, b: VectorLike) {
        return new Vector(a.x - b.x, a.y - b.y);
    }

    subtract(other: VectorLike) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }

    rotate(radians: number) {
        var cos = Math.cos(radians);
        var sin = Math.sin(radians);
        this.x = cos * this.x - sin * this.y;
        this.y = sin * this.x + cos * this.y;
        return this;
    }

    copy() {
        return new Vector(this.x, this.y);
    }

    static scale(vec: Vector, scale: number) {
        return new Vector(vec.x * scale, vec.y * scale);
    }

    scaleBy(scale: number) {
        this.x *= scale;
        this.y *= scale;
    }

    scaledBy(scale: number) {
        const v = this.copy();
        v.scaleBy(scale);
        return v;
    }

    // Possible divide by zero
    scaleToLength(targetLength: number) {
        const length = this.getLength();
        const ratio = targetLength / length;
        this.scaleBy(ratio);
    }

    getLengthSquared(): number {
        return this.x ** 2 + this.y ** 2;
    }

    getLength(): number {
        return Math.sqrt(this.getLengthSquared());
    }

    getUnitVector() {
        const l = this.getLength();
        return new Vector(this.x / l, this.y / l);
    }

    lengthenBy(c: number) {
        const u = this.getUnitVector();
        u.scaleBy(c);
        this.add(u);
    }

    shortenToLength(c: number) {
        const length = this.getLength();
        if (length > c) {
            this.scaleToLength(c);
        }
    }

    getState(_toGet: StateIndexer<VectorState> = {}): RecursivePartial<VectorState> {
        return {
            x: this.x,
            y: this.y
        }
    }

    setState({ x, y }: RecursivePartial<VectorState>): StateIndexer<VectorState> {
        if (x !== undefined) {
            this.x = x
        }
        if (y !== undefined) {
            this.y = y
        }
        return {};
    }

    // Remember that we use clock angles
    // with y inverted, which means
    // we are using the unit circle rotated 
    // clockwise pi/4. In these new coordinates,
    // x <- -y and y <- x
    getAngle(): Angle {
        return new Angle(Math.atan2(this.x, -this.y));
    }
}
const VectorType = t.type({ x: t.number, y: t.number });
type VectorLike = t.TypeOf<typeof VectorType>;


class Angle implements Stateful<AngleState> {
    private _angle!: number
    constructor(angle: number) {
        this.angle = angle
    }

    private static mod(val: number) {
        return ((val % TWO_PI) + TWO_PI) % TWO_PI;
    }

    set angle(val: number) {
        this._angle = Angle.mod(val);
    }

    get angle() {
        return this._angle;
    }

    add(other: Angle | number) {
        if (other instanceof Angle) {
            this.angle += other.angle;
        }
        else {
            this.angle += other
        }
    }

    subtract(other: Angle | number) {
        if (other instanceof Angle) {
            this.angle -= other.angle
        }
        else {
            this.angle -= other
        }
    }

    // Returns a number in [-pi, pi)
    static minus(a: Angle, b: Angle): number {
        let difference = Angle.mod(a.angle - b.angle);
        if (difference >= Math.PI) {
            difference -= TWO_PI;
        }
        return difference;
    }

    // What you would need to add to this angle
    // to turn it into the other angle
    distanceTo(other: Angle) {
        return Angle.minus(other, this);
    }

    // Remember that we use clock angles
    // with y inverted, which means
    // we are using the unit circle rotated 
    // clockwise pi/4. An angle x in this circle corresponds
    // to the coordinate cos(x - pi/4), sin(x - pi/4)
    // which is the same as cos, sin shifted pi/4
    // to the left, which becomes sin, -cos
    getUnitVector(): Vector {
        return new Vector(
            Math.sin(this.angle),
            -Math.cos(this.angle)
        );
    }

    getState(): PartialState<AngleState> {
        return this.angle;
    }
    setState(state: number): StateIndexer<AngleState> {
        this.angle = state;
        return {};
    }
}




const AngleType = t.number;
export { Vector, VectorType, VectorLike, Angle, AngleType }