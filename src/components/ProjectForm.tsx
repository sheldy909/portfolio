'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Project {
  id?: number;
  title: string;
  description: string;
  category: string;
  slug: string;
  image_url?: string;
}

interface ProjectFormProps {
  project?: Project;
  onSave: () => void;
  onCancel: () => void;
}

export default function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState<Project>({
    title: project?.title || '',
    description: project?.description || '',
    category: project?.category || 'portfolio',
    slug: project?.slug || '',
    image_url: project?.image_url || '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (project?.id) {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update(formData)
          .eq('id', project.id);

        if (error) throw error;
      } else {
        // Insert new project
        const { error } = await supabase
          .from('projects')
          .insert([formData]);

        if (error) throw error;
      }

      onSave();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error saving project');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>{project ? 'Edit Project' : 'Add New Project'}</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Category:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value="portfolio">Portfolio</option>
            <option value="archive">Archive</option>
            <option value="useful">Useful</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Slug:</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Image URL:</label>
          <input
            type="url"
            name="image_url"
            value={formData.image_url}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#6c757d', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}