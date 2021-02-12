import { styled } from '../../config/theme';
import { flexCenterXY } from "../../styles/shared-style";
const Links = styled.div`
  ${flexCenterXY}
  flex-direction: column;
  padding-top: 40px;

  a{
    color: ${(props) => props.theme.color.opium};
  }
`;

export default Links