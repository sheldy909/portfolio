'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import ProjectForm from '@/components/ProjectForm';
import ProjectImagesForm from '@/components/ProjectImagesForm';

interface Project {
  id: number;
  title: string;
  description: string;
  slug: string;
  category: string;
  image_url?: string;
}

export default function AdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showImagesForm, setShowImagesForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    setShowForm(false);
    setSelectedProject(null);
    fetchProjects();
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setShowForm(true);
  };

  const handleDelete = async (projectId: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', projectId);

        if (error) throw error;
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Error deleting project');
      }
    }
  };

  const handleCategoryChange = async (projectId: number, newCategory: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ category: newCategory })
        .eq('id', projectId);

      if (error) throw error;
      fetchProjects();
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Error updating category');
    }
  };

  if (showForm) {
    return (
      <div>
        <button onClick={() => setShowForm(false)} style={{ marginBottom: '20px' }}>
          ← Back to Admin
        </button>
        <ProjectForm 
          project={selectedProject || undefined} 
          onSave={handleSave} 
          onCancel={() => setShowForm(false)} 
        />
      </div>
    );
  }

  if (showImagesForm && selectedProject) {
    return (
      <div>
        <button onClick={() => setShowImagesForm(false)} style={{ marginBottom: '20px' }}>
          ← Back to Admin
        </button>
        <h2>Images for: {selectedProject.title}</h2>
        <ProjectImagesForm projectId={selectedProject.id} />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '30px' }}>Admin Panel</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <Link href="/" style={{ marginRight: '15px', textDecoration: 'none', color: '#007bff' }}>
          View Site
        </Link>
        <button
          onClick={() => setShowForm(true)}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add New Project
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Projects</h2>
        
        {loading ? (
          <p>Loading projects...</p>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {projects.map((project) => (
              <div key={project.id} style={{ 
                border: '1px solid #ddd', 
                borderRadius: '8px', 
                padding: '20px',
                backgroundColor: '#fff'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 5px 0' }}>{project.title}</h3>
                    <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                      {project.description?.substring(0, 100)}...
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleEdit(project)}
                      style={{ 
                        padding: '5px 10px', 
                        backgroundColor: '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setShowImagesForm(true)}
                      style={{ 
                        padding: '5px 10px', 
                        backgroundColor: '#17a2b8', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Images
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      style={{ 
                        padding: '5px 10px', 
                        backgroundColor: '#dc3545', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ fontSize: '14px', color: '#666' }}>Category:</span>
                  <select
                    value={project.category}
                    onChange={(e) => handleCategoryChange(project.id, e.target.value)}
                    style={{ padding: '5px', border: '1px solid #ddd', borderRadius: '4px' }}
                  >
                    <option value="portfolio">Portfolio</option>
                    <option value="archive">Archive</option>
                    <option value="useful">Useful</option>
                  </select>
                  
                  <Link href={`/projects/${project.slug}`} style={{ 
                    color: '#007bff', 
                    textDecoration: 'none',
                    fontSize: '14px'
                  }}>
                    View Project
                  </Link>
                </div>

                {project.image_url && (
                  <div style={{ marginTop: '15px' }}>
                    <img
                      src={project.image_url}
                      alt={project.title}
                      style={{ width: '100px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {projects.length === 0 && !loading && (
          <p style={{ color: '#666' }}>No projects found. Add your first project!</p>
        )}
      </div>
    </div>
  );
}