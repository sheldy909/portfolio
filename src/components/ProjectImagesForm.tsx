'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface ProjectImage {
  id?: number;
  project_id: number;
  image_url: string;
  caption?: string;
  order: number;
}

interface ProjectImagesFormProps {
  projectId: number;
}

export default function ProjectImagesForm({ projectId }: ProjectImagesFormProps) {
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [newImages, setNewImages] = useState<{file: File; caption: string}[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, [projectId]);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('project_images')
        .select('*')
        .eq('project_id', projectId)
        .order('order', { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImageFiles = Array.from(files).map(file => ({
      file,
      caption: ''
    }));
    setNewImages(prev => [...prev, ...newImageFiles]);
  };

  const handleCaptionChange = (index: number, caption: string) => {
    setNewImages(prev => {
      const updated = [...prev];
      updated[index].caption = caption;
      return updated;
    });
  };

  const uploadImages = async () => {
    setLoading(true);
    try {
      for (let i = 0; i < newImages.length; i++) {
        const { file, caption } = newImages[i];
        
        // Upload file to Supabase storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${projectId}-${Date.now()}-${i}.${fileExt}`;
        const filePath = `project-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('project-images')
          .getPublicUrl(filePath);

        // Insert into database
        const { error: insertError } = await supabase
          .from('project_images')
          .insert([{
            project_id: projectId,
            image_url: publicUrl,
            caption,
            order: images.length + i
          }]);

        if (insertError) throw insertError;
      }

      // Reset form and refresh images
      setNewImages([]);
      await fetchImages();
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images');
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (imageId: number) => {
    try {
      const { error } = await supabase
        .from('project_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;
      await fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error deleting image');
    }
  };

  const updateImageOrder = async (imageId: number, newOrder: number) => {
    try {
      const { error } = await supabase
        .from('project_images')
        .update({ order: newOrder })
        .eq('id', imageId);

      if (error) throw error;
      await fetchImages();
    } catch (error) {
      console.error('Error updating image order:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Project Images</h3>
      
      {/* Upload Section */}
      <div style={{ marginBottom: '20px' }}>
        <h4>Add New Images</h4>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          style={{ marginBottom: '10px' }}
        />
        
        {newImages.length > 0 && (
          <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '10px' }}>
            <h5>New Images:</h5>
            {newImages.map((newImage, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <p>{newImage.file.name}</p>
                <input
                  type="text"
                  placeholder="Caption"
                  value={newImage.caption}
                  onChange={(e) => handleCaptionChange(index, e.target.value)}
                  style={{ width: '100%', padding: '5px', marginBottom: '5px' }}
                />
              </div>
            ))}
            <button
              onClick={uploadImages}
              disabled={loading}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#28a745', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Uploading...' : 'Upload Images'}
            </button>
          </div>
        )}
      </div>

      {/* Existing Images */}
      <div>
        <h4>Existing Images</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
          {images.map((image) => (
            <div key={image.id} style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '10px' }}>
              <img
                src={image.image_url}
                alt={image.caption || ''}
                style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }}
              />
              {image.caption && (
                <p style={{ margin: '5px 0', fontSize: '14px' }}>{image.caption}</p>
              )}
              <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                <input
                  type="number"
                  value={image.order}
                  onChange={(e) => updateImageOrder(image.id!, parseInt(e.target.value))}
                  style={{ width: '60px', padding: '5px' }}
                  min="0"
                />
                <button
                  onClick={() => deleteImage(image.id!)}
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
          ))}
        </div>
        
        {images.length === 0 && (
          <p style={{ color: '#666' }}>No images found for this project.</p>
        )}
      </div>
    </div>
  );
}