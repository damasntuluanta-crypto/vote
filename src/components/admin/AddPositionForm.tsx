'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface AddPositionFormProps {
  electionId: string;
  onPositionAdded: () => void;
}

export function AddPositionForm({ electionId, onPositionAdded }: AddPositionFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    max_votes: 1,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'max_votes' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('positions').insert([
        {
          election_id: electionId,
          ...formData,
        },
      ]);

      if (error) throw error;

      toast.success('Position added successfully!');
      setFormData({ name: '', description: '', max_votes: 1 });
      onPositionAdded();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add position');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="text-lg font-bold text-gray-900">Add Position</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Position Name *
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
          className="input h-20 resize-none"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max Votes
        </label>
        <input
          type="number"
          name="max_votes"
          value={formData.max_votes}
          onChange={handleChange}
          className="input"
          min="1"
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Adding...' : 'Add Position'}
      </button>
    </form>
  );
}
