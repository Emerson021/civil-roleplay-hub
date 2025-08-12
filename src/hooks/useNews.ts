import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface NewsPost {
  id: string;
  title: string;
  description: string;
  content: string;
  slug: string | null;
  status: 'published' | 'draft';
  featured: boolean;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  author_id: string;
  category_id: string | null;
  profiles?: {
    full_name: string | null;
  };
  categories?: {
    name: string;
    slug: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export const useNews = () => {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile, isAuthenticated } = useAuth();

  const fetchPosts = async () => {
    try {
      let query = supabase
        .from('news_posts')
        .select(`
          *,
          profiles!news_posts_author_id_fkey(full_name),
          categories(name, slug)
        `)
        .order('created_at', { ascending: false });

      // If not authenticated, only fetch published posts
      if (!isAuthenticated) {
        query = query.eq('status', 'published');
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching posts:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as notícias",
          variant: "destructive",
        });
        return;
      }

      setPosts((data as NewsPost[]) || []);
    } catch (error) {
      console.error('Error in fetchPosts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }

      setCategories(data || []);
    } catch (error) {
      console.error('Error in fetchCategories:', error);
    }
  };

  const createPost = async (postData: {
    title: string;
    description: string;
    content: string;
    category_id: string;
    image_url?: string;
  }) => {
    if (!profile?.user_id) return null;

    try {
      const { data, error } = await supabase
        .from('news_posts')
        .insert({
          ...postData,
          author_id: profile.user_id,
          status: 'draft'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating post:', error);
        toast({
          title: "Erro",
          description: "Não foi possível criar a postagem",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Sucesso",
        description: "Postagem criada com sucesso",
      });

      fetchPosts(); // Refresh posts
      return data;
    } catch (error) {
      console.error('Error in createPost:', error);
      return null;
    }
  };

  const updatePost = async (id: string, updates: Partial<NewsPost>) => {
    try {
      const { error } = await supabase
        .from('news_posts')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating post:', error);
        toast({
          title: "Erro",
          description: "Não foi possível atualizar a postagem",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Sucesso",
        description: "Postagem atualizada com sucesso",
      });

      fetchPosts(); // Refresh posts
      return true;
    } catch (error) {
      console.error('Error in updatePost:', error);
      return false;
    }
  };

  const deletePost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('news_posts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting post:', error);
        toast({
          title: "Erro",
          description: "Não foi possível deletar a postagem",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Sucesso",
        description: "Postagem deletada com sucesso",
      });

      fetchPosts(); // Refresh posts
      return true;
    } catch (error) {
      console.error('Error in deletePost:', error);
      return false;
    }
  };

  const togglePostStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    const updates: any = { status: newStatus };
    
    if (newStatus === 'published') {
      updates.published_at = new Date().toISOString();
    }

    return updatePost(id, updates);
  };

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [isAuthenticated]);

  return {
    posts,
    categories,
    loading,
    createPost,
    updatePost,
    deletePost,
    togglePostStatus,
    refetch: fetchPosts
  };
};