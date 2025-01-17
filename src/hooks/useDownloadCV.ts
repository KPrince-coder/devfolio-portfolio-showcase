import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CVDownload {
  resume_url: string;
}

export const useDownloadCV = () => {
  return useQuery<CVDownload, Error>({
    queryKey: ["profile-data"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profile_data")
        .select("resume_url")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching social links:", error);

        throw error;
      }

      console.log("Social links fetched:", data);

      return data as CVDownload;
    },
  });
};
