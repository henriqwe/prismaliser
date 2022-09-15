/* eslint-disable react/no-unknown-property */
import React, { useMemo } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
} from "react-flow-renderer";

import EnumNode from "~/components/EnumNode";
import ModelNode from "~/components/ModelNode";
import RelationEdge from "~/components/RelationEdge";
import { dmmfToElements, schemaToElements } from "~/util/dmmfToElements";
import { DMMFToElementsResult, schemaType } from "~/util/types";

import type { DMMF } from "@prisma/generator-helper";

const nodeTypes = {
  entity: ModelNode,
  enum: EnumNode,
};

const edgeTypes = {
  relation: RelationEdge,
};

const FlowView = ({ dmmf, schema }: FlowViewProps) => {
  // TODO: move to controlled nodes/edges, and change this to generate a NodeChanges[] as a diff so that positions gets preserved.
  // Will be more complex but gives us better control over how they're handled, and makes storing locations EZ.
  // https://reactflow.dev/docs/guides/migrate-to-v10/#11-controlled-nodes-and-edges
  const { nodes, edges } = useMemo(
    () =>
      dmmf
        ? dmmfToElements(dmmf)
        : ({ nodes: [], edges: [] } as DMMFToElementsResult),
    [dmmf]
  );

  const { nodes: nodes_ycl, edges: edges_ycl } = useMemo(
    () =>
      schema
        ? schemaToElements(schema)
        : ({ nodes: [], edges: [] } as DMMFToElementsResult),
    [schema]
  );
  console.group("nodes");
  console.log({ nodes, edges });
  console.log({ nodes_ycl, edges_ycl });
  console.groupEnd();

  return (
    <>
      <ReactFlow
        defaultNodes={nodes_ycl}
        defaultEdges={edges_ycl}
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        minZoom={0.1}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={2}
          color="currentColor"
          className="text-gray-200"
        />
        <Controls />
      </ReactFlow>
      <svg width="0" height="0">
        <defs>
          <marker
            id="prismaliser-1n"
            markerWidth="32.5"
            markerHeight="12.5"
            viewBox="-20 0 20 20"
            orient="auto-start-reverse"
            refX="0"
            refY="0"
          >
            <text
              x="-35"
              y="15"
              fill="gray"
              className="text-gray-400 stroke-current text-xs"
            >
              1..*
            </text>
          </marker>
          <marker
            id="prismaliser-n1"
            markerWidth="22.5"
            markerHeight="12.5"
            viewBox="-10 -20 20 20"
            orient="auto-start-reverse"
            refX="0"
            refY="0"
          >
            <text
              x="-10"
              y="-15"
              fill="gray"
              className="text-gray-400 stroke-current text-xs"
              rotate={180}
            >
              1
            </text>
          </marker>
        </defs>
      </svg>
    </>
  );
};

export interface FlowViewProps {
  dmmf: DMMF.Datamodel | null;
  schema: schemaType | undefined;
}

export default FlowView;
