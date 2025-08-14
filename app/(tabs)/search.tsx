import {View, Text, Button, SafeAreaView, FlatList} from 'react-native'
import React, {useEffect} from 'react'
import seed from "@/lib/seed";
import useAppWrite from "@/lib/useAppWrite";
import {getCategory, getMenu} from "@/lib/appwrite";
import {useLocalSearchParams} from "expo-router";
import CartButton from "@/components/CartButton";
import cn from 'clsx';
import MenuCard from "@/components/MenuCard";
import {MenuItem} from "@/type";


const Search = () => {
    const {category, query} = useLocalSearchParams<{query:string, category:string}>()
    const {data, refetch, loading, error} = useAppWrite({
        fn: getMenu,
        params:{
            category,
            query,
            limit:6,
        }
    })
    const {data:categories} = useAppWrite({ fn: getCategory})

    useEffect(() => {
        refetch({category, query, limit:6})
    }, [category, query]);
    console.log(data);
    return (
        <SafeAreaView className="bg-white h-full">

           <FlatList data={data} renderItem={({item, index}) => {
               const isFirstRightColItem = index % 2 === 0;

               return(
                   <View className={cn("flex-1 max-w-[48%]", !isFirstRightColItem ? 'mt-10':'mt-0')}>
                       <MenuCard item={item as MenuItem}/>
                   </View>
               )

           }}
           keyExtractor={item=>item.$id}
           numColumns={2}
           columnWrapperClassName="gap-7"
           contentContainerClassName="gap-7 px-5 pb-32"
           ListHeaderComponent={() => (
               <View className='my-5 gap-5'>
                   <View className="flex-between flex-row w-full">
                       <View className="flex-start">
                           <Text className="small-bold uppercase text-primary">Search</Text>
                           <View className="flex-start flex-row gap-x-1 mt-0.5 ">
                               <Text className="paragraph-semibold text-dark-100">Find your favorite food</Text>
                           </View>
                       </View>
                       <CartButton/>
                   </View>

                   <Text>Search Input</Text>
                   <Text>Filter</Text>
               </View>
           )}
                     ListEmptyComponent={() => !loading && <Text>No results found</Text>}/>


        </SafeAreaView>
    )
}
export default Search
