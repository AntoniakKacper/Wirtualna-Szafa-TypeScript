import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { ReactComponent as OutfitImage } from "images/outfit.svg";
import { RootState } from "store";
import {
  addUserCloth,
  getAddedClothes,
  removeClothFromUserList,
} from "store/actions/clothActions";
//eslint-disable-next-line
import { BrowserRouter as Router, Link } from "react-router-dom";
import { addOutfit, getOutfitsByDate } from "store/actions/outfitActions";
import { Cloth } from "store/types/clothTypes";
import { Outfit } from "store/types/outfitTypes";
import { ColorCircle, DisplayColor, ItemCard, ItemInfo } from "styles/Card";
import {
  BackArrow,
  Info,
  NavigationBar,
  NoItemsAdded,
  SaveChangesButton,
  Wrapper,
} from "../Clothes/styles/AddClothesStyles";
import {
  AddedClothesContainer,
  ClickableIcon,
  Line,
  OutfitForm,
  OwnedClothesContainer,
  StyledAddIcon,
  StyledDeleteIcon,
  StyledInput,
} from "./styles/AddOutfitsStyles";
import DateFnsUtils from "@date-io/date-fns";
import { format, parseISO } from "date-fns";

interface AddOutfitsProps extends RouteComponentProps<{ category: string }> {}

export const AddOutfits: React.FC<AddOutfitsProps> = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const action = useDispatch();
  const { userClothes } = useSelector((state: RootState) => state.cloth);
  const [addedClothes, setAddedClothes] = useState<Cloth[]>([]);
  const [name, setName] = useState("");
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);

  useEffect(() => {
    user && action(getAddedClothes(user.id));

    return () => {
      setAddedClothes([]);
      setName("");
    };
  }, []);

  const HandleSave = () => {
    const initialState: Outfit = {
      id: "",
      clothesList: addedClothes,
      name: name,
      userId: user!.id,
      likesCount: 0,
      likes: [],
      calendarDate: selectedDate
        ? format(parseISO(selectedDate!.toISOString()), "MM/d/yyyy")
        : "",
    };

    action(addOutfit(initialState));
  };

  const AddClothToOutfit = (cloth: Cloth) => {
    setAddedClothes([...addedClothes, cloth]);
    action(removeClothFromUserList(cloth));
  };

  const RemoveClothFromOutfit = (cloth: Cloth) => {
    setAddedClothes(addedClothes.filter((item) => item.id !== cloth.id));
    action(addUserCloth(cloth));
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  return (
    <Wrapper>
      <NavigationBar>
        <BackArrow to="/add">
          <ArrowBackIosIcon fontSize="large" />
        </BackArrow>

        {addedClothes.length > 2 && addedClothes.length <= 6 && (
          <Link to="/myOutfits">
            <SaveChangesButton onClick={() => HandleSave()}>
              Save
            </SaveChangesButton>
          </Link>
        )}
      </NavigationBar>
      <AddedClothesContainer>
        <h2>Add Outfit</h2>
        {addedClothes.length > 2 && addedClothes.length <= 6 && (
          <OutfitForm>
            <StyledInput
              label="Name"
              variant="outlined"
              onChange={(event) => setName(event.target.value)}
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd/MM/yyyy"
                margin="normal"
                label="Add this outfit to calendar"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
          </OutfitForm>
        )}
        {addedClothes.length > 0 ? (
          addedClothes.map((item: Cloth, index: number) => (
            <ItemCard key={index}>
              <img src={item.imageUrl} alt={item.name} />
              <ItemInfo>
                <p>
                  <span>Name:</span> {item.name}
                </p>
                <p>
                  <span>Catergory:</span> {item.category}
                </p>
                <p>
                  <span>Weather:</span> {item.weather}
                </p>
                <p>
                  <span>Ocassion:</span> {item.occasion}
                </p>
                <DisplayColor>
                  <span>Color:</span>
                  <ColorCircle color={item.color}></ColorCircle>
                </DisplayColor>
              </ItemInfo>
              <ClickableIcon>
                <StyledDeleteIcon onClick={() => RemoveClothFromOutfit(item)} />
              </ClickableIcon>
            </ItemCard>
          ))
        ) : (
          <NoItemsAdded>
            <OutfitImage width="70px" height="70px" />
            <Info>{`There are no outfits added`}</Info>
          </NoItemsAdded>
        )}
      </AddedClothesContainer>

      <Line />

      <OwnedClothesContainer>
        <h2>Owned clothes</h2>
        {userClothes.map((item: Cloth, index: number) => (
          <ItemCard key={index}>
            <img src={item.imageUrl} alt={item.name} />
            <ItemInfo>
              <p>
                <span>Name:</span> {item.name}
              </p>
              <p>
                <span>Catergory:</span> {item.category}
              </p>
              <p>
                <span>Weather:</span> {item.weather}
              </p>
              <p>
                <span>Ocassion:</span> {item.occasion}
              </p>
              <DisplayColor>
                <span>Color:</span>
                <ColorCircle color={item.color}></ColorCircle>
              </DisplayColor>
            </ItemInfo>
            <ClickableIcon>
              <StyledAddIcon onClick={() => AddClothToOutfit(item)} />
            </ClickableIcon>
          </ItemCard>
        ))}
      </OwnedClothesContainer>
    </Wrapper>
  );
};
