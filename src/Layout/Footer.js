import {
  Typography,
  Grid
} from "@mui/material";

const Footer = () => {
  return (
    <footer>
      <Grid container spacing={2} sx={{mt:5}}>
        <Grid item xs={12} sx={{textAlign:"center"}}>
          <Typography variant="p" noWrap component="div">
            Cosmic Academy
          </Typography>
        </Grid>
      </Grid>
    </footer>
  );
};

export default Footer;
