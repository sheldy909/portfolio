import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

interface Project {
  id: number;
  title: string;
  description: string;
  slug: string;
  category: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

interface ProjectImage {
  id: number;
  image_url: string;
  caption?: string;
  order: number;
}

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const { data: projects } = await supabase
    .from('projects')
    .select('slug');

  return projects?.map((project) => ({
    slug: project.slug,
  })) || [];
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = params;

  // Fetch project data
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (projectError || !project) {
    notFound();
  }

  // Fetch project images
  const { data: images, error: imagesError } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', project.id)
    .order('order', { ascending: true });

  if (imagesError) {
    console.error('Error fetching images:', imagesError);
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <button
        onClick={() => window.history.back()}
        style={{ marginBottom: '20px', padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        ← Back
      </button>

      <article style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        {project.image_url && (
          <img
            src={project.image_url}
            alt={project.title}
            style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px', marginBottom: '20px' }}
          />
        )}

        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#333' }}>{project.title}</h1>
        
        <div style={{ marginBottom: '20px' }}>
          <span style={{ 
            backgroundColor: '#007bff', 
            color: 'white', 
            padding: '4px 12px', 
            borderRadius: '20px', 
            fontSize: '14px',
            textTransform: 'capitalize'
          }}>
            {project.category}
          </span>
        </div>

        <div style={{ 
          lineHeight: '1.8', 
          color: '#666', 
          fontSize: '16px',
          whiteSpace: 'pre-wrap'
        }}>
          {project.description}
        </div>

        <div style={{ marginTop: '30px' }}>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>Images</h3>
          {images && images.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {images.map((image) => (
                <div key={image.id} style={{ textAlign: 'center' }}>
                  <img
                    src={image.image_url}
                    alt={image.caption || ''}
                    style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  {image.caption && (
                    <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>{image.caption}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#666' }}>No images available for this project.</p>
          )}
        </div>
      </article>
    </div>
  );
}