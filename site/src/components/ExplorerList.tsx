import { useState, useEffect } from 'react';

interface AnsibleItem {
  type: 'role' | 'playbook';
  name: string;
  path: string;
  description: string;
}

interface TerraformModule {
  name: string;
  path: string;
  variables: string[];
  description: string;
}

interface MiscItem {
  type: 'packer' | 'vagrant' | 'docker' | 'other';
  name: string;
  path: string;
  description: string;
}

interface ExplorerData {
  ansible?: AnsibleItem[];
  terraform?: TerraformModule[];
  misc?: MiscItem[];
}

const ExplorerList = () => {
  const [data, setData] = useState<ExplorerData>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const baseUrl = import.meta.env.BASE_URL;
        
        // Load all explorer data
        const [ansibleRes, terraformRes, miscRes] = await Promise.all([
          fetch(`${baseUrl}/explorer/ansible.json`).catch(() => null),
          fetch(`${baseUrl}/explorer/terraform.json`).catch(() => null),
          fetch(`${baseUrl}/explorer/misc.json`).catch(() => null),
        ]);

        const explorerData: ExplorerData = {};
        
        if (ansibleRes?.ok) {
          explorerData.ansible = await ansibleRes.json();
        }
        if (terraformRes?.ok) {
          explorerData.terraform = await terraformRes.json();
        }
        if (miscRes?.ok) {
          explorerData.misc = await miscRes.json();
        }

        setData(explorerData);
      } catch (error) {
        console.error('Failed to load explorer data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filterItems = () => {
    const items: Array<{ type: string; data: any }> = [];

    if ((filter === 'all' || filter === 'ansible') && data.ansible) {
      items.push(...data.ansible.map(item => ({ type: 'ansible', data: item })));
    }
    if ((filter === 'all' || filter === 'terraform') && data.terraform) {
      items.push(...data.terraform.map(item => ({ type: 'terraform', data: item })));
    }
    if ((filter === 'all' || filter === 'misc') && data.misc) {
      items.push(...data.misc.map(item => ({ type: 'misc', data: item })));
    }

    if (searchTerm) {
      return items.filter(item => 
        item.data.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.data.path?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.data.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return items;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="skeleton h-32 w-full"></div>
        ))}
      </div>
    );
  }

  const filteredItems = filterItems();

  return (
    <div>
      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search artifacts..."
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="tabs tabs-boxed">
          <button
            className={`tab ${filter === 'all' ? 'tab-active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`tab ${filter === 'ansible' ? 'tab-active' : ''}`}
            onClick={() => setFilter('ansible')}
          >
            Ansible
          </button>
          <button
            className={`tab ${filter === 'terraform' ? 'tab-active' : ''}`}
            onClick={() => setFilter('terraform')}
          >
            Terraform
          </button>
          <button
            className={`tab ${filter === 'misc' ? 'tab-active' : ''}`}
            onClick={() => setFilter('misc')}
          >
            Other
          </button>
        </div>
      </div>

      {/* Results */}
      {filteredItems.length === 0 ? (
        <div className="alert alert-info">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>No artifacts found. Try adjusting your search or filter.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredItems.map((item, idx) => (
            <div key={idx} className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`badge ${
                        item.type === 'ansible' ? 'badge-primary' :
                        item.type === 'terraform' ? 'badge-secondary' :
                        'badge-accent'
                      }`}>
                        {item.type}
                      </span>
                      {item.data.type && (
                        <span className="badge badge-ghost">{item.data.type}</span>
                      )}
                    </div>
                    <h3 className="card-title text-lg">{item.data.name}</h3>
                    <p className="text-sm opacity-70 mb-2">{item.data.path}</p>
                    {item.data.description && (
                      <p className="text-sm">{item.data.description}</p>
                    )}
                    {item.type === 'terraform' && item.data.variables && item.data.variables.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs font-semibold">Variables: </span>
                        <span className="text-xs opacity-70">{item.data.variables.join(', ')}</span>
                      </div>
                    )}
                  </div>
                  <a
                    href={`https://github.com/cywf/Infraguard/blob/main/${item.data.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-ghost"
                    aria-label={`View ${item.data.name} on GitHub`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExplorerList;
