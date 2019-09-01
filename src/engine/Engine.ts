import { GameState } from "./GameState";
import { GameDataInterface } from "novadatainterface/GameDataInterface";
import { System } from "./System";
import { Stateful, StateIndexer, RecursivePartial, PartialState } from "./Stateful";
import { Steppable } from "./Steppable";
import { SystemState } from "./SystemState";
import { StatefulMap } from "./StatefulMap";
import * as UUID from "uuid/v4";
import { BuildingMap } from "./BuildingMap";
import { ShipState } from "./ShipState";
import { Ship } from "./Ship";

class MissingSystemError extends Error {
    constructor(system: string) {
        super("Missing system " + system)
    }
}

class Engine implements Stateful<GameState>, Steppable {
    private gameData: GameDataInterface;
    private systems: BuildingMap<System, SystemState>;

    // This map is not necessarily in sync
    // and is only updated when needed
    private shipSystemMap: Map<string, string>;

    readonly activeSystems: Set<string>;
    private uuidFunction: () => string;

    constructor({ gameData, state, uuidFunction }: { gameData: GameDataInterface, state?: PartialState<GameState>, uuidFunction?: () => string }) {
        this.uuidFunction = uuidFunction || UUID;
        this.gameData = gameData;

        this.shipSystemMap = new Map();
        this.systems = new BuildingMap<System, SystemState>(
            System.makeFactory(this.gameData),
            System.fullState
        );

        this.activeSystems = new Set();

        if (state) {
            this.setState(state);
        }
        else {

        }
    }

    step(milliseconds: number) {
        for (let systemID of this.activeSystems) {
            var system = this.systems.get(systemID);
            if (system === undefined) {
                throw new MissingSystemError(systemID);
            }
            system.step(milliseconds);
        }
    }

    // Serializes the current state of the game
    getState(toGet: StateIndexer<GameState> = {}): PartialState<GameState> {
        return {
            systems: this.systems.getState(toGet.systems)
        };
    }

    // Set the current state of the game
    setState(state: PartialState<GameState>): StateIndexer<GameState> {
        const missing: StateIndexer<GameState> = {};

        if (state.systems) {
            missing.systems = this.systems.setState(state.systems);
        }

        return missing;

    }

    getSystemFullState(systemUUID: string): SystemState {
        let system = this.systems.get(systemUUID);
        if (system) {
            return system.getFullState();
        }
        else {
            throw Error("Unknown system " + systemUUID);
        }
    }

    getSystemContainingShip(shipUUID: string): SystemState {
        let system = this.getShipSystem(shipUUID);
        return system.getFullState();
    }

    private searchForShipSystem(shipUUID: string): System {
        for (let systemUUID of this.systems.keys()) {
            let system = this.systems.get(systemUUID);
            if (system === undefined) {
                throw new Error("Impossible");
            }
            let ship = system.ships.get(shipUUID)
            if (ship !== undefined) {
                this.shipSystemMap.set(shipUUID, systemUUID);
                return system;
            }
        }
        throw new Error("Ship " + shipUUID + " not found");
    }

    private getShipSystem(shipUUID: string): System {
        const possibleSystemUUID = this.shipSystemMap.get(shipUUID);
        if (possibleSystemUUID === undefined) {
            return this.searchForShipSystem(shipUUID);
        }
        else {
            const possibleSystem = this.systems.get(possibleSystemUUID);
            if (possibleSystem === undefined) {
                return this.searchForShipSystem(shipUUID);
            }
            else {
                const possibleShip = possibleSystem.ships.get(shipUUID);
                if (possibleShip === undefined) {
                    return this.searchForShipSystem(shipUUID);
                }
                else {
                    return possibleSystem;
                }

            }
        }
    }

    private getShip(shipUUID: string): Ship {

        return this.getShipSystem(shipUUID).ships.get(shipUUID) as Ship; // Known to be defined. See getShipSystem.
    }


    // Set the state of a ship
    setShipState(shipUUID: string, shipState: PartialState<ShipState>) {
        const ship = this.getShip(shipUUID);
        ship.setState(shipState);
    }



    static async fromGameData(gameData: GameDataInterface): Promise<Engine> {
        const systems: { [index: string]: SystemState } = {};

        const systemIDs = (await gameData.ids).System;

        for (let id of systemIDs) {
            systems[id] = await System.fromID(id, gameData);
        }

        let state: GameState = { systems };

        return new Engine({
            state,
            gameData
        });
    }
}

export { Engine }
