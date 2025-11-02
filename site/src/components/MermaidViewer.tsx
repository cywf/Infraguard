import { useEffect, useState } from 'react';

interface MermaidDiagram {
  name: string;
  path: string;
  content: string;
}

const MermaidViewer = () => {
  const [diagrams, setDiagrams] = useState<MermaidDiagram[]>([]);
  const [selectedDiagram, setSelectedDiagram] = useState<MermaidDiagram | null>(null);
  const [loading, setLoading] = useState(true);
  const [mermaidLoaded, setMermaidLoaded] = useState(false);

  useEffect(() => {
    // Load Mermaid library
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js';
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      if (window.mermaid) {
        // @ts-ignore
        window.mermaid.initialize({ 
          startOnLoad: false, 
          theme: 'dark',
          securityLevel: 'loose',
        });
        setMermaidLoaded(true);
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const loadDiagrams = async () => {
      try {
        const baseUrl = import.meta.env.BASE_URL;
        const response = await fetch(`${baseUrl}/diagrams/index.json`);
        
        if (response.ok) {
          const diagramList = await response.json();
          setDiagrams(diagramList);
          if (diagramList.length > 0) {
            setSelectedDiagram(diagramList[0]);
          }
        }
      } catch (error) {
        console.error('Failed to load diagrams:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDiagrams();
  }, []);

  useEffect(() => {
    if (mermaidLoaded && selectedDiagram) {
      renderDiagram();
    }
  }, [mermaidLoaded, selectedDiagram]);

  const renderDiagram = async () => {
    if (!selectedDiagram || !mermaidLoaded) return;

    const container = document.getElementById('mermaid-container');
    if (!container) return;

    try {
      // @ts-ignore
      const { svg } = await window.mermaid.render('mermaid-diagram', selectedDiagram.content);
      container.innerHTML = svg;
    } catch (error) {
      console.error('Failed to render Mermaid diagram:', error);
      container.innerHTML = `
        <div class="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Failed to render diagram. Please check the syntax.</span>
        </div>
      `;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-12 w-full"></div>
        <div className="skeleton h-96 w-full"></div>
      </div>
    );
  }

  if (diagrams.length === 0) {
    return (
      <div className="alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <h3 className="font-bold">No Diagrams Available</h3>
          <div className="text-sm">
            Add .mmd files to the repository or include Mermaid code blocks in README.md to see diagrams here.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Diagram Selector */}
      <div className="flex flex-wrap gap-2">
        {diagrams.map((diagram, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedDiagram(diagram)}
            className={`btn btn-sm ${selectedDiagram === diagram ? 'btn-primary' : 'btn-outline'}`}
          >
            {diagram.name}
          </button>
        ))}
      </div>

      {/* Diagram Display */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          {selectedDiagram && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="card-title">{selectedDiagram.name}</h2>
                <a
                  href={`https://github.com/cywf/Infraguard/blob/main/${selectedDiagram.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-ghost"
                  aria-label="View source on GitHub"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              </div>
              <div id="mermaid-container" className="mermaid flex justify-center items-center p-4 bg-base-300 rounded-lg overflow-x-auto">
                {!mermaidLoaded && (
                  <div className="skeleton h-96 w-full"></div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MermaidViewer;
