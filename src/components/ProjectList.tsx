'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

interface Project {
  id: number;
  title: string;
  description: string;
  slug: string;
  category: string;
  image_url?: string;
}

interface ProjectListProps {
  category: string;
}

export const getProjectsByCategory = async (category: string) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('category', category)
    .order('id', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return data || [];
};

export default function ProjectList({ category }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await getProjectsByCategory(category);
        setProjects(fetchedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [category]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
        marginTop: '20px'
      }}>
        {projects.map((project) => (
          <Link 
            key={project.id} 
            href={`/projects/${project.slug}`}
            style={{ 
              textDecoration: 'none', 
              color: 'inherit',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '16px',
              backgroundColor: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {project.image_url && (
              <img 
                src={project.image_url} 
                alt={project.title} 
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} 
              />
            )}
            <h3 style={{ margin: '10px 0 5px 0' }}>{project.title}</h3>
            <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
              {project.description?.substring(0, 100)}...
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}