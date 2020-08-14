/// <reference types="node" />
import * as Cluster from "cluster";
export default function (modulePath: string, configPath: string): Cluster.Worker;
