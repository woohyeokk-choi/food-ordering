import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { Product } from "../../types";

export const useProductList = () => {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        throw new Error(error.message);
      }
      return data as Product[];
    },
  });
};

export const useProduct = (id: number) => {
  return useQuery<Product>({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id);
      if (error) {
        throw new Error(error.message);
      }
      return data[0] as Product;
    },
  });
};

export const useInsertProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: any) {
      const { error, data: newProduct } = await supabase
        .from("products")
        .insert({
          name: data.name,
          image: data.image,
          price: data.price,
        })
        .select();

      if (error) {
        throw new Error(error.message);
      }
      return newProduct[0] as Product;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: any) {
      const { data: updatedProduct, error } = await supabase
        .from("products")
        .update({
          name: data.name,
          image: data.image,
          price: data.price,
        })
        .eq("id", data.id)
        .select();

      if (error) {
        console.error("Error updating product:", error); // Debugging line
        throw new Error(error.message);
      }
      console.log("Updated product data:", updatedProduct); // Debugging line
      if (!updatedProduct || updatedProduct.length !== 1) {
        throw new Error("Product not found or multiple products returned");
      }
      return updatedProduct[0] as Product;
    },
    async onSuccess(_, { id }) {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["product", id] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: any) {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", data.id);

      if (error) {
        console.error("Error deleting product:", error); // Debugging line
        throw new Error(error.message);
      }
      return;
    },
    async onSuccess(_, { id }) {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["product", id] });
    },
  });
};
