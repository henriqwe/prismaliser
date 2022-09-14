import cc from "classcat";
import React from "react";
import {
  Handle,
  Position,
  useReactFlow,
  useStoreApi,
} from "react-flow-renderer";

import styles from "./Node.module.scss";

import { ModelNodeData } from "~/util/types";

type ColumnData = ModelNodeData["columns"][number];

const isTarget = ({
  kind,
  isList,
  relationFromFields,
  relationName,
  relationType,
}: ColumnData) =>
  kind === "enum" ||
  ((relationType === "1-n" || relationType === "m-n") && !isList) ||
  (relationType === "1-1" && !relationFromFields?.length) ||
  // Fallback for implicit m-n tables (maybe they should act like the child in a
  // 1-n instead)
  (kind === "scalar" && !!relationName);

const isSource = ({ isList, relationFromFields, relationType }: ColumnData) =>
  ((relationType === "1-n" || relationType === "m-n") && isList) ||
  (relationType === "1-1" && !!relationFromFields?.length);

const ModelNode = ({ data }: ModelNodeProps) => {
  const store = useStoreApi();
  const { setCenter, getZoom } = useReactFlow();

  const focusNode = (nodeId: string) => {
    const { nodeInternals } = store.getState();
    const nodes = Array.from(nodeInternals).map(([, node]) => node);

    if (nodes.length > 0) {
      const node = nodes.find((iterNode) => iterNode.id === nodeId);

      if (!node) return;

      const x = node.position.x + node.width! / 2;
      const y = node.position.y + node.height! / 2;
      const zoom = getZoom();

      setCenter(x, y, { zoom, duration: 1000 });
    }
  };
  return (
    <table
      className="font-sans bg-white border-2 border-separate border-black rounded-lg"
      style={{ minWidth: 200, maxWidth: 500, borderSpacing: 0 }}
    >
      <thead title={data.documentation}>
        <tr>
          <th
            className="p-2 font-extrabold bg-gray-200 border-b-2 border-black rounded-t-md "
            colSpan={4}
          >
            <div className="flex flex-col">
              <span className="text-xs"> &lt;&lt;Entity&gt;&gt;</span>
              <span>{data.name}</span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.columns
          .filter((col) => col.relation !== true)
          .map((col) => (
            <tr key={col.name} className={styles.row} title={col.documentation}>
              <td className="font-mono font-semibold">
                <button
                  type="button"
                  className={cc([
                    "relative",
                    "py-1",
                    "px-2",

                    { "cursor-pointer": isTarget(col) || isSource(col) },
                  ])}
                  onClick={() => {
                    if (!isTarget(col) && !isSource(col)) return;

                    focusNode(col.type);
                  }}
                >
                  {col.name}:{" "}
                  <span className="text-gray-500">{col.displayType}</span>
                </button>
              </td>
            </tr>
          ))}
        {data.relationsTarget?.map((relations) => {
          return (
            <Handle
              key={`${data.name}-${relations.name}`}
              className={cc([styles.handle, styles.left])}
              type="source"
              id={`${data.name}-${relations.name}-${relations._conf.type.value}`}
              position={Position.Left}
              isConnectable={false}
            />
          );
        })}
        {data.relationsSource?.map((relations) => {
          console.log(">>>> relationsSource relations", relations);
          console.log(">>>> ", `${data.name}-${relations.name}`);

          return (
            <Handle
              key={`${data.name}-${relations.name}`}
              className={cc([styles.handle, styles.Right])}
              type="target"
              id={`${data.name}-${relations.name}`}
              position={Position.Right}
              isConnectable={false}
            />
          );
        })}
      </tbody>
    </table>
  );
};
export interface ModelNodeProps {
  data: ModelNodeData;
}

export default ModelNode;
