import { Alert, Container, Snackbar, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import { useEffect } from "react";
import { db } from "../services/firebase";
import {
  doc,
  setDoc,
  collection,
  query,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

function DataGridTable() {
  const [wantedListAPI, setWantedListAPI] = useState([]);
  const [wantedFBI, setWantedFBI] = useState([]);
  const [snackbar, setSnackbar] = useState(null);
  useEffect(() => {
    fetch("https://api.fbi.gov/wanted/v1/list")
      .then((res) => res.json())
      .then((data) => {
        setWantedListAPI(data.items);
        wantedListAPI.forEach(async (person) => {
          await setDoc(doc(db, "fbidata", person.uid), {
            id: person.uid,
            fullName: person.title,
            nationality: person.nationality,
            sex: person.sex,
            hair: person.hair,
            eyes: person.eyes,
            birthdate: person.dates_of_birth_used[0],
          });
        });
      });
  }, []);

  useEffect(() => {
    const q = query(collection(db, "fbidata"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const thieves = [];
      querySnapshot.forEach((doc) => {
        thieves.push({ id: doc.id, ...doc.data() });
      });
      setWantedFBI(thieves);
    });
  }, [wantedListAPI]);

  const useFakeMutation = () => {
    return useCallback(
      (user) =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            if (user.fullName === "") {
              reject(
                new Error("Error while saving user: name can't be empty.")
              );
            } else {
              resolve({ ...user, fullName: user.fullName.toUpperCase() });
            }
          }, 200);
        }),
      []
    );
  };
  const mutateRow = useFakeMutation();
  const handleCloseSnackbar = () => setSnackbar(null);
  const processRowUpdate = useCallback(
    async (newRow) => {
      const thieveRef = await updateDoc(doc(db, "fbidata", newRow.id), {
        fullName: newRow.fullName,
      });
      const response = await mutateRow(newRow);
      setSnackbar({ children: "User successfully saved", severity: "success" });
      return response;
    },
    [mutateRow]
  );

  const handleProcessRowUpdateError = useCallback((error) => {
    setSnackbar({ children: error.message, severity: "error" });
  }, []);

  //DataGrid columns
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 300,
      editable: true,
    },
    {
      field: "nationality",
      headerName: "Nationality",
      width: 110,
      editable: false,
    },
    {
      field: "sex",
      headerName: "Sex",
      sortable: false,
      width: 110,
    },
    {
      field: "hair",
      headerName: "Hair color",
      sortable: false,
      width: 110,
      filterable: false,
    },
    {
      field: "eyes",
      headerName: "Eyes color",
      sortable: false,
      width: 110,
    },
    {
      field: "birthdate",
      headerName: "Birth Date",
      type: "date",
      width: 180,
      editable: false,
    },
  ];

  //DataGrid rows
  const rows = wantedFBI?.map((person) => {
    return {
      id: person.id,
      fullName: person.fullName,
      nationality: person.nationality,
      sex: person.sex,
      hair: person.hair,
      eyes: person.eyes,
      birthdate: new Date(person.birthdate),
    };
  });

  if (!wantedFBI?.length) {
    return (
      <Container>
        <Typography sx={{ textAlign: "center" }}>
          No wanted person now
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={handleProcessRowUpdateError}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 6,
              },
            },
          }}
          pageSizeOptions={[6]}
          checkboxSelection
          disableRowSelectionOnClick
        />
        {!!snackbar && (
          <Snackbar
            open
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            onClose={handleCloseSnackbar}
            autoHideDuration={6000}
          >
            <Alert {...snackbar} onClose={handleCloseSnackbar} />
          </Snackbar>
        )}
      </Box>
    </Container>
  );
}

export default DataGridTable;
