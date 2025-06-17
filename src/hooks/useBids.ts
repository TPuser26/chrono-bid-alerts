
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useBids = (auctionId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Récupérer les offres pour une enchère
  const { data: bids, isLoading } = useQuery({
    queryKey: ['bids', auctionId],
    queryFn: async () => {
      if (!auctionId) return [];
      
      const { data, error } = await supabase
        .from('bids')
        .select(`
          id,
          amount,
          timestamp,
          user_id,
          profiles!bids_user_id_fkey (email)
        `)
        .eq('auction_id', auctionId)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!auctionId,
  });

  // Récupérer l'historique des offres d'un utilisateur
  const getUserBids = useQuery({
    queryKey: ['user-bids'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('bids')
        .select(`
          id,
          amount,
          timestamp,
          auctions!bids_auction_id_fkey (
            id,
            title,
            status,
            current_bid
          )
        `)
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Soumettre une nouvelle offre
  const submitBid = useMutation({
    mutationFn: async ({ auctionId, amount }: { auctionId: string; amount: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Vous devez être connecté pour enchérir");

      // Vérifier l'enchère actuelle
      const { data: auction, error: auctionError } = await supabase
        .from('auctions')
        .select('current_bid, status, end_time')
        .eq('id', auctionId)
        .single();

      if (auctionError) throw auctionError;
      
      if (auction.status !== 'active') {
        throw new Error("Cette enchère n'est plus active");
      }

      if (new Date() > new Date(auction.end_time)) {
        throw new Error("Cette enchère est terminée");
      }

      if (amount <= auction.current_bid) {
        throw new Error(`Votre offre doit être supérieure à l'enchère actuelle de ${auction.current_bid}€`);
      }

      // Insérer la nouvelle offre
      const { data, error } = await supabase
        .from('bids')
        .insert({
          auction_id: auctionId,
          user_id: user.id,
          amount: amount,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Offre soumise",
        description: "Votre enchère a été enregistrée avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ['bids'] });
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      queryClient.invalidateQueries({ queryKey: ['user-bids'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    bids,
    isLoading,
    submitBid,
    getUserBids,
  };
};
