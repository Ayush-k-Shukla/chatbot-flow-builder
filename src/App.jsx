import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import ControlPannel from './components/control-panel';
import Node from './components/node';
import { generateRandomText } from './core/helper';
import styles from './index.module.scss';

const initialNodes = [
  {
    id: '1',
    type: 'textnode',
    data: { label: 'initial node' },
    position: { x: 150, y: 15 },
  },
];

const getId = () => `dndnode_${generateRandomText(4)}`;

const LOCAL_STORAGE_KEY = 'my-key';

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const reactFlowWrapper = useRef(null);
  const [showMessage, setShowMessage] = useState('');

  const { setViewport } = useReactFlow();

  useEffect(() => {
    const flow = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

    if (flow && edges.length === 0) {
      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
      setViewport({ x, y, zoom });
    }
  }, []);

  useEffect(() => {
    if (selectedNode) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNode?.id) {
            node.data = {
              ...node.data,
              label: selectedNode.data.label,
            };
          }
          return node;
        })
      );
    } else {
      setSelectedNode(null);
    }
  }, [selectedNode, setNodes]);

  const nodeTypes = useMemo(
    () => ({
      textnode: Node,
    }),
    []
  );

  // Handles edge connection
  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  // returns count of empty target handles
  const getEmptyTargetHandles = () => {
    return edges?.reduce((acc, cur) => {
      if (!cur.targetHandle) {
        return acc + 1;
      }
      return acc;
    }, 0);
  };

  // returns count of unconnected nodes
  const getUnconnectedNodes = useCallback(() => {
    let uncntNodes = nodes.filter(
      (node) =>
        !edges.find(
          (edge) => edge.source === node.id || edge.target === node.id
        )
    );

    return uncntNodes.length;
  }, [nodes, edges]);

  const handleSave = useCallback(() => {
    if (reactFlowInstance) {
      const emtHandles = getEmptyTargetHandles();

      if (nodes.length > 1 && (emtHandles > 1 || getUnconnectedNodes())) {
        setShowMessage('Cannot save flow');
        setTimeout(() => {
          setShowMessage('');
        }, 2000);
      } else {
        const flow = reactFlowInstance.toObject();
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(flow));

        setShowMessage('Saved successfully!');
        setTimeout(() => {
          setShowMessage('');
        }, 2000);
      }
    }
  }, [reactFlowInstance, nodes, getUnconnectedNodes]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setNodes((nodes) =>
      nodes.map((n) => ({
        ...n,
        selected: n.id === node.id,
      }))
    );
  }, []);

  return (
    <div className={styles.parentWrapper}>
      {showMessage.length ? (
        <div className={styles.msg}>{showMessage}</div>
      ) : (
        <></>
      )}
      <div className={styles.topHeader}>
        <button onClick={handleSave}>Save Changes</button>
      </div>

      <div className={styles.bottomContent}>
        <div className={styles.playground} ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            fitView
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
          >
            <Background variant='dots' gap={11} size={1} />
            <Controls />
          </ReactFlow>
        </div>
        <div className={styles.sidepanel}>
          <ControlPannel
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
          />
        </div>
      </div>
    </div>
  );
}
