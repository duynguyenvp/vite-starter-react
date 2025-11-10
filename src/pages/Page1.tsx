import React, { useState, useCallback, useMemo } from 'react';
import { NodeApi, Tree, type NodeRendererProps } from 'react-arborist';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// ========== 🔹 Types ==========
type AccessLevel = 1 | 2 | 3 | 4; // 1: Cá nhân, 2: Nhóm, 3: Phòng ban, 4: Công ty
type NodeType = 'company' | 'department' | 'group' | 'user';

interface Metadata {
  createdAt?: string;
  description?: string;
  memberCount?: number;
  createdBy?: string;
}

interface NodeData {
  id: string;
  name: string;
  type: NodeType;
  level: AccessLevel;
  metadata?: Metadata;
  children?: NodeData[];
}

// ========== 🔹 Fake Tree Data ==========
const organizationTree: NodeData[] = [
  {
    id: 'c1',
    name: 'Công ty ABC',
    type: 'company',
    level: 4,
    metadata: {
      description: 'Công ty công nghệ hàng đầu Việt Nam',
      memberCount: 120,
    },
    children: [
      {
        id: 'd1',
        name: 'Phòng Kỹ thuật',
        type: 'department',
        level: 3,
        metadata: { memberCount: 40 },
        children: [
          {
            id: 'g1',
            name: 'Nhóm React Team',
            type: 'group',
            level: 2,
            metadata: { memberCount: 8 },
            children: [
              { id: 'u1', name: 'Nguyễn Văn A', type: 'user', level: 1 },
              { id: 'u2', name: 'Trần Thị B', type: 'user', level: 1 },
            ],
          },
        ],
      },
      {
        id: 'd2',
        name: 'Phòng Nhân sự',
        type: 'department',
        level: 3,
        metadata: { memberCount: 10 },
      },
    ],
  },
];

// 🔹 Định nghĩa kiểu Document
interface Document {
  name: string;
  size?: string; // Ví dụ: "2.3 MB"
  modified?: string; // Ví dụ: "2025-11-01"
}

// ========== 🔹 Fake API ==========
async function fetchFilesByNodeId(nodeId: string): Promise<Document[]> {
  // Giả lập call API
  await new Promise((r) => setTimeout(r, 700));

  // Dữ liệu mô phỏng
  const mockData: Record<string, Document[]> = {
    c1: [
      { name: 'Tầm nhìn 2025.pdf', size: '1.2 MB', modified: '2025-09-12' },
      { name: 'Chiến lược phát triển.docx', size: '850 KB', modified: '2025-09-15' },
    ],
    d1: [
      { name: 'Quy trình kỹ thuật.txt', size: '24 KB', modified: '2025-10-01' },
      { name: 'Checklist QA.xlsx', size: '130 KB', modified: '2025-10-03' },
    ],
    g1: [
      { name: 'Hướng dẫn React.md', size: '18 KB', modified: '2025-08-20' },
      { name: 'Báo cáo sprint 10.pdf', size: '970 KB', modified: '2025-09-05' },
    ],
    u1: [
      { name: 'TaskList_A.txt', size: '12 KB', modified: '2025-07-10' },
      { name: 'Báo cáo tháng 3.docx', size: '210 KB', modified: '2025-03-31' },
    ],
    u2: [],
  };

  return mockData[nodeId] || [];
}

// ========== 🔹 Helper ==========
const getIconForType = (type: NodeType, isOpen: boolean) => {
  switch (type) {
    case 'company':
      return '🏢';
    case 'department':
      return isOpen ? '🏬' : '🏣';
    case 'group':
      return '👥';
    case 'user':
      return '👤';
    default:
      return '📁';
  }
};

// ========== 🔹 Component ==========
const Page1: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [files, setFiles] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);

  const columnDefs = useMemo(
    () => [
      { field: 'name' as keyof Document, headerName: 'Name', flex: 1 },
      { field: 'size' as keyof Document, headerName: 'Size', width: 100 },
      { field: 'modified' as keyof Document, headerName: 'Modified', width: 140 },
    ],
    [],
  );

  const defaultColDef = useMemo(() => ({ sortable: true, filter: true, resizable: true }), []);

  const handleNodeClick = useCallback(async (node: NodeApi<NodeData>) => {
    const data: NodeData = node.data;
    setSelectedNode(data);
    setLoading(true);
    setFiles([]);

    const result = await fetchFilesByNodeId(data.id);
    setFiles(result);
    setLoading(false);
  }, []);

  const NodeRenderer = ({ node, style, dragHandle }: NodeRendererProps<NodeData>) => {
    const isSelected = selectedNode?.id === node.data.id;
    return (
      <div
        className={`
          flex items-center cursor-pointer select-none
          rounded-md relative
          transition-all duration-150 ease-in-out
          px-2 py-[4px] h-7
          ${
            isSelected
              ? 'bg-blue-100 text-blue-700 font-medium ring-1 ring-blue-300 z-10'
              : 'hover:bg-gray-50 hover:ring-1 hover:ring-gray-200 z-0'
          }
        `}
        style={{ ...style, boxSizing: 'border-box', marginBottom: '2px' }}
        ref={dragHandle}
        onClick={() => handleNodeClick(node)}
      >
        <span className="w-5 text-center">{getIconForType(node.data.type, node.isOpen)}</span>
        <span className="ml-2 truncate">{node.data.name}</span>
      </div>
    );
  };

  return (
    <div className="h-full p-4 flex flex-col md:flex-row gap-4">
      {/* Sidebar trái */}
      <div className="w-full md:w-80 bg-white rounded-lg shadow border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700">Cấu trúc tổ chức</h2>
        </div>
        <div className="p-2 h-[calc(100vh-10rem)] overflow-auto">
          <Tree<NodeData> initialData={organizationTree} openByDefault>
            {NodeRenderer}
          </Tree>
        </div>
      </div>

      {/* Khu vực hiển thị file */}
      <div className="flex-1 bg-white rounded-lg shadow border border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700">
            {selectedNode ? selectedNode.name : 'Danh sách file'}
          </h2>
        </div>

        <div className="flex-1 p-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-500 text-base">
              <span className="animate-spin mr-2">⏳</span> Đang tải...
            </div>
          ) : !selectedNode ? (
            <div className="flex items-center justify-center h-full text-gray-400 italic">
              Chưa chọn node nào
            </div>
          ) : files.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400 italic">
              Không có file nào
            </div>
          ) : (
            <AgGridReact
              rowData={files}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              rowSelection="single"
              animateRows
              className="w-full h-full"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Page1;
