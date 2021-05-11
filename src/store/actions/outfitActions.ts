import { ThunkAction } from "redux-thunk"
import { RootState } from ".."
import { database } from "../../database/firebase"
import { ADD_OUTFIT, AppActions, COUNT_CLOTHES_IN_OUTFIT, DELETE_OUTFIT, GET_ALL_OUTFITS, GET_USER_OUTFITS } from "../types/actionTypes"
import { Cloth } from "../types/clothTypes"
import { MostUsedCloth, Outfit } from "../types/outfitTypes"

export const addOutfit = (outfit: Outfit): ThunkAction<void, RootState, null, AppActions> => {
    return async dispatch => {
        try{

            const ref = await database.collection("Outfits").doc();
            ref.set({...outfit, id: ref.id});
            dispatch({
                type: ADD_OUTFIT,
                payload: outfit,
            })
        }
        catch (error){
            console.log(error)
        }
    }
}

export const getUserOutfits = (uId: string): ThunkAction<void, RootState, null, AppActions> => {
    return async dispatch => {
        try{
            let listOfOutfits: Outfit[] = []
            await database.collection("Outfits").get().then((snapshot) => {
                snapshot.forEach((doc) => listOfOutfits = [...listOfOutfits, doc.data() as Outfit])
            });

            listOfOutfits = listOfOutfits.filter((outfit) => outfit.userId === uId);
            dispatch({
                type: GET_USER_OUTFITS,
                payload: listOfOutfits,
            })
        }
        catch (error){
            console.log(error)
        }
    }
}

export const deleteOutfit = (outfit: Outfit): ThunkAction<void, RootState, null, AppActions> => {
    return async dispatch => {
        try{
            await database.collection("Outfits").doc(outfit.id).delete();
            dispatch({
                type: DELETE_OUTFIT,
                payload: outfit,
            })
        }
        catch (error){
            console.log(error)
        }
    }
}

export const getAllOutfits = (): ThunkAction<void, RootState, null, AppActions> => {
    return async dispatch => {
        try{
            let listOfOutfits: Outfit[] = []
            await database.collection("Outfits").get().then((snapshot) => {
                snapshot.forEach((doc) => listOfOutfits = [...listOfOutfits, doc.data() as Outfit])
            });
            dispatch({
                type: GET_ALL_OUTFITS,
                payload: listOfOutfits,
            })
            
        }
        catch (error){
            console.log(error)
        }
    }
}

export const countClothInOutfits = (uId: string): ThunkAction<void, RootState, null, AppActions> => {
    return async dispatch => {
        try{
            //FIX THIS FUNCTION
            let initialState: MostUsedCloth = {
                cloth: null,
                count: 0,
              };
            let listOfMostUsedClothes: MostUsedCloth[] = [];

            let listOfOutfits: Outfit[] = []
            await database.collection("Outfits").get().then((snapshot) => {
                snapshot.forEach((doc) => listOfOutfits = [...listOfOutfits, doc.data() as Outfit])
            });
            listOfOutfits = listOfOutfits.filter((outfit) => outfit.userId === uId);

            let clothesList: Cloth[] = []
            await database.collection("Clothes").get().then((snapshot) => {
                snapshot.forEach((doc) => clothesList = [...clothesList, doc.data() as Cloth])
            });
            clothesList = clothesList.filter((cloth) => cloth.userId === uId);

            

            clothesList.map((cloth: Cloth) => {
                listOfOutfits.find((outfit) => outfit.clothesList.find((outfiCloth) => {
                    if(outfiCloth.id === cloth.id){
                        initialState = {cloth: cloth, count: initialState.count + 1}
                        
                    }
                }))
                listOfMostUsedClothes.push(initialState)
                initialState = {
                    cloth: null,
                    count: 0,
                  };
            })
            let mostUsedCloth = listOfMostUsedClothes.reduce((max, cloth) => max.count > cloth.count ? max : cloth);

   
            dispatch({
                type: COUNT_CLOTHES_IN_OUTFIT,
                payload: mostUsedCloth,
            })
            
        }
        catch (error){
            console.log(error)
        }
    }
}