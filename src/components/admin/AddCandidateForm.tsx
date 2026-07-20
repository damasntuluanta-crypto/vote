'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface AddCandidateFormProps {
  positionId: string;
  onCandidateAdded: () => void;
}

export function AddCandidateForm({ positionId, onCandidateAdded }: AddCandidateFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    qualifications: '',
    photo_url: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('candidates').insert([
        {
          position_id: positionId,
          ...formData,
        },
      ]);

      if (error) throw error;

      toast.success('Candidate added successfully!');
      setFormData({ name: '', description: '', qualifications: '', photo_url: '' });
      onCandidateAdded();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add candidate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4 mb-6">
      <h4 className="font-bold text-gray-900">Add Candidate</h4>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Candidate Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="input"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="input h-16 resize-none"
          rows={2}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Qualifications
        </label>
        <textarea
          name="qualifications"
          value={formData.qualifications}
          onChange={handleChange}
          className="input h-16 resize-none"
          rows={2}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Photo URL
        </label>
        <input
          type="url"
          name="photo_url"
          value={formData.photo_url}
          onChange={handleChange}
          className="input"
          placeholder="https://example.com/photo.jpg"
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Adding...' : 'Add Candidate'}
      </button>
    </form>
  );
}
