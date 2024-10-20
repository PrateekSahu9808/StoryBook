import './TableTree.scss';
import React, { useEffect, useRef, useState } from 'react';

interface ColumnDataProps {
  name: string;
  accessor: string;
  width: string;
  isClickable?: boolean;
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
  withCheckBox,
  columnsData,
  treeData,
  // onClick = () => {},
}: TableTreeProps) => {
  const calculateTotalChildrenHeight = (node: any): number => {
    if (!node.children || node.children.length === 0) {
      return 1; // Base height for a single node
    }

    let totalHeight = 0; // Start from 0 to sum heights
    node.children.forEach((child: any) => {
      totalHeight += calculateTotalChildrenHeight(child); // Recursive height calculation
    });
    return totalHeight + 1; // Add one for the current node
  };

  const TreeNode = ({ node, level, isLast }: any) => {
    const nodeRef = useRef<HTMLTableRowElement | null>(null);
    const [nodeHeight, setNodeHeight] = useState<number>(0);
    const [totalChildHeight, setTotalChildHeight] = useState<number>(0);

    useEffect(() => {
      if (nodeRef.current) {
        const height = nodeRef.current.offsetHeight;
        setNodeHeight(height);
      }
    }, [nodeRef]);

    const totalHeight = calculateTotalChildrenHeight(node);

    useEffect(() => {
      if (node.children && node.children.length > 0) {
        const height = node.children.reduce((acc: number, child: any) => {
          return acc + calculateTotalChildrenHeight(child);
        }, 0);
        setTotalChildHeight(height);
      }
    }, [node.children]);

    return (
      <>
        <tr
          ref={nodeRef}
          className={`node-li ${node.children ? 'has-children' : ''} ${
            isLast ? 'is-last' : ''
          }`}
          style={
            {
              '--level': level,
              '--total-height': totalHeight,
              '--total-child-height': `${totalChildHeight * 25}px`, // Adjust based on the node height
              '--node-height': `${nodeHeight}px`, // Set node height dynamically
            } as React.CSSProperties
          }
        >
          <td className="title-container">
            <span className="folder">
              {node.folder && (
                <svg
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.36047 8.49999L4.76721 13.0933C4.42253 13.438 4.42253 13.9968 4.76721 14.3415C5.11189 14.6862 5.67073 14.6862 6.01538 14.3415L11.2328 9.12408C11.2328 9.12407 11.2328 9.12407 11.2328 9.12406C11.3984 8.95857 11.4913 8.73404 11.4913 8.49999C11.4913 8.26594 11.3984 8.0414 11.2328 7.87592C11.2328 7.87591 11.2328 7.8759 11.2328 7.8759L6.01538 2.65852C5.67074 2.31382 5.11189 2.31383 4.76721 2.65852C4.42253 3.00321 4.42253 3.56196 4.76721 3.90665L4.83792 3.83594L4.76721 3.90665L9.36047 8.49999Z"
                    fill="#71347B"
                    stroke="#71347B"
                    strokeWidth="0.2"
                  />
                </svg>
              )}
              {withCheckBox && (
                <input
                  style={{ width: '14px', height: '14px', marginLeft: '8px' }}
                />
              )}
            </span>
            <div
              className="title"
              style={{ fontWeight: node.folder ? 600 : 400 }}
            >
              {node.title}
            </div>
          </td>

          {columnsData.map((column: any) => (
            <td key={column.accessor} style={{ width: column.width }}>
              {node[column.accessor]}
            </td>
          ))}
        </tr>

        {node.children &&
          node.children.length > 0 &&
          renderTree(node.children, level + 1)}
      </>
    );
  };

  const renderTree = (nodes: any, level = 0) => {
    return nodes.map((node: any, index: number) => {
      const isLast = index === nodes.length - 1;
      return (
        <TreeNode key={node.key} node={node} level={level} isLast={isLast} />
      );
    });
  };

  return (
    <div className="tree-container">
      <table>
        <thead>
          <tr>
            <th style={{ minWidth: '760px' }}>Execution</th>
            {columnsData.map((column: any) => (
              <th key={column.accessor} style={{ width: column.width }}>
                {column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="tree">{renderTree(treeData)}</tbody>
      </table>
    </div>
  );
};

export default TableTree;
