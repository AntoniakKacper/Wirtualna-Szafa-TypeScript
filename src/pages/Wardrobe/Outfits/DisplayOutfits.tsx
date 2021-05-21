import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { getAllOutfits } from "store/actions/outfitActions";
import { Wrapper } from "./styles/OutfitCardStyles";
import { OutfitCard } from "./OutfitCard";
import { Outfit } from "store/types/outfitTypes";

interface DisplayOutfitsProps {}

const DisplayOutfits: React.FC<DisplayOutfitsProps> = ({}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { outfits } = useSelector((state: RootState) => state.outfit);
  const action = useDispatch();

  useEffect(() => {
    //user && action(getUserOutfits(user.id));
    action(getAllOutfits());
  }, []);
  return (
    <Wrapper>
      <h2>My outfits</h2>
      {outfits
        .filter((outfit) => outfit.userId === user?.id)
        .map((outfit: Outfit) => (
          <OutfitCard outfit={outfit} key={outfit.id} myOutfits={true} />
        ))}
    </Wrapper>
  );
};

export default DisplayOutfits;
