
import { supabase } from "@/integrations/supabase/client";
import { slugify } from "./blogUtils";

interface Blog {
  id: number;
  title: string;
  slug?: string | null;
  author?: string;
  content?: string;
  coverimage?: string;
  created_at?: string;
  excerpt?: string;
  image_url?: string;
  published?: boolean;
  publishedat?: string;
  tags?: string[];
  updated_at?: string;
}

export async function migrateExistingPostsToSlug() {
  const { data: posts, error } = await supabase
    .from('blogs')
    .select('id, title, slug')
    .is('slug', null)
    .returns<Blog[]>();

  if (error) {
    console.error('Error fetching posts:', error);
    return;
  }

  for (const post of posts) {
    const slug = slugify(post.title);
    const { error: updateError } = await supabase
      .from('blogs')
      .update({ slug })
      .eq('id', post.id);

    if (updateError) {
      console.error(`Error updating post ${post.id}:`, updateError);
    }
  }
}