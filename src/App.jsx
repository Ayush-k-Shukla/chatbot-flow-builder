import { useCallback, useMemo, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import ControlPannel from './components/control-panel';
import Node from './components/node';
import styles from './index.module.scss';

const initialNodes = [
  {
    id: '1',
    type: 'textnode',
    data: { label: 'initial node' },
    position: { x: 150, y: 15 },
  },
];

const LOCAL_STORAGE_KEY = 'my-key';

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [nodeName, setNodeName] = useState('');
  const [selected, setSelected] = useState([]);
  const reactFlowWrapper = useRef(null);
  const [showMessage, setShowMessage] = useState('');

  const nodeTypes = useMemo(
    () => ({
      textnode: Node,
    }),
    []
  );

  // Handles edge connection
  const onConnect = useCallback(
    (params) => {
      console.log('Edge added- ', params);
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

      console.log('dd');
    }
    console.log('out');
  }, [reactFlowInstance, nodes, getUnconnectedNodes]);

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
        <div className={styles.playground}>
          <ReactFlow
            nodes={initialNodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            fitView
          >
            <Background variant='dots' gap={11} size={1} />
            <Controls />
            <MiniMap zoomable pannable />
          </ReactFlow>
        </div>
        <div className={styles.sidepanel}>
          <ControlPannel nodeSelected={true} />
        </div>
      </div>
    </div>
  );
}
