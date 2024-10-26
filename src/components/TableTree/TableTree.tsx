/* eslint-disable */
// @ts-nocheck
import './TableTree.scss';
import React, { ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { prepareData } from '../../utils/TableCell/TableCell';

import { checkEmpty } from '../../utils/checkEmpty/checkEmpty';

interface ColumnDataProps {
  name: string;
  accessor: string;
  width: string;
  isClickable?: boolean;
  minWidth?: string;
  cell?: (e: any) => JSX.Element | string | ReactNode;
}

interface ObjectProps {
  [key: string]: any;
}

interface TableTreeProps {
  withCheckBox: boolean;
  columnsData: Array<ColumnDataProps>;
  treeData: Array<ObjectProps>;
  onClick?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    data: any
  ) => void;
}

const TableTree = ({
  columnsData,
  treeData,
  onClick = () => {},
}: TableTreeProps) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<ObjectProps>>(
    new Set()
  );

  useLayoutEffect(() => {
    const defaultExpanded: Set<ObjectProps> = new Set();

    // Recursive function to add nodes and their children to the expanded set
    const expandNodeRecursively = (node: ObjectProps) => {
      if (node.expanded) {
        // Add the node to the expanded set
        defaultExpanded.add(node);

        // If the node has children, recursively expand them as well
        if (node.children) {
          node.children.forEach((child: ObjectProps) =>
            expandNodeRecursively(child)
          );
        }
      }
    };

    // Iterate over the treeData to check which nodes should be expanded
    treeData.forEach((node) => {
      expandNodeRecursively(node);
    });

    // Set the expanded nodes state
    setExpandedNodes(defaultExpanded);
  }, [treeData]);
  // Function to calculate total children height
  const calculateTotalChildrenHeight = (node: any): number => {
    if (!node.children || node.children.length === 0) {
      return 1;
    }
    // Start with 1 for the current node and  node itself is included in the height calculation before considering its children.
    let totalHeight = 1;
    if (expandedNodes.has(node)) {
      node.children.forEach((child: any) => {
        totalHeight += calculateTotalChildrenHeight(child);
      });
    }
    return totalHeight;
  };

  const TreeNode = ({ node, level, isLast }: any) => {
    const nodeRef = useRef<HTMLTableRowElement | null>(null);
    const [nodeHeight, setNodeHeight] = useState<number>(0);
    const [totalChildrenHeight, setTotalChildrenHeight] = useState<number>(0);

    const isExpanded = expandedNodes.has(node);

    useLayoutEffect(() => {
      if (nodeRef.current) {
        const observer = new ResizeObserver(() => {
          // Update nodeHeight when the size of the element changes
          const currentHeight = nodeRef.current?.offsetHeight || 0;
          setNodeHeight(currentHeight);

          // Calculate total children height
          const childrenHeight = calculateTotalChildrenHeight(node);
          setTotalChildrenHeight(childrenHeight);
        });

        // Start observing the current node
        observer.observe(nodeRef.current);

        return () => {
          observer.disconnect();
        };
      }
    }, [isExpanded, node]);

    const handleToggleExpand = () => {
      setExpandedNodes((prev) => {
        const newExpandedNodes = new Set(prev);
        if (newExpandedNodes.has(node)) {
          newExpandedNodes.delete(node); // Collapse the node
        } else {
          newExpandedNodes.add(node); // Expand the node
        }
        return newExpandedNodes;
      });
    };
    const renderRowData = (columnsData: any) => {
      return columnsData.map((column: any) => {
        if (column.accessor) {
          return (
            <td key={column.accessor} style={{ maxWidth: column.width }}>
              {prepareData(node, column)}
            </td>
          );
        }
      });
    };
    return (
      <>
        <tr
          ref={nodeRef}
          className={`ff-node-li ${node.children ? 'ff-has-children' : ''} ${
            isLast ? 'ff-is-last' : ''
          }`}
          style={
            {
              '--level': level,
              '--node-height': `${nodeHeight}px`,
              '--total-children-height': `${
                totalChildrenHeight * nodeHeight
              }px`,
            } as React.CSSProperties
          }
        >
          <td className="ff-title-container">
            <span
              className="ff-toggle-folder"
              onClick={handleToggleExpand}
              style={{ cursor: 'pointer' }}
            >
              {node.folder && (
                <span
                  className={`ff-toggle-arrow-icon ${
                    isExpanded ? 'ff-expanded' : 'ff-collapsed'
                  }`}
                >
                  +
                </span>
              )}
            </span>

            <div
              className="ff-title"
              style={{ fontWeight: node.folder ? 600 : 400 }}
              onClick={(event) => onClick(event, node)}
            >
              <div style={{ marginLeft: node.folder ? '4px' : '12px' }}>
                {node.title}
              </div>
            </div>
          </td>
          {renderRowData(columnsData)}
        </tr>

        {/* Render children only if the node is expanded */}
        {isExpanded &&
          !checkEmpty(node?.children) &&
          renderTree(node.children, level + 1)}
      </>
    );
  };

  const renderTree = (nodes: any, level = 0) => {
    return nodes.map((node: any, index: number) => {
      const isLast = index === nodes.length - 1;
      return <TreeNode key={index} node={node} level={level} isLast={isLast} />;
    });
  };

  return (
    <div className="ff-tree-container">
      <table>
        <thead>
          <tr>
            {columnsData.map((column: any, index) => (
              <th
                key={column.accessor}
                style={
                  index === 0
                    ? { minWidth: column.width }
                    : { width: column.width }
                }
              >
                {column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{renderTree(treeData)}</tbody>
      </table>
    </div>
  );
};

export default TableTree;
