
import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, Button, Autocomplete } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useForm } from 'react-hook-form';

// Custom import for truncated text functionality
import { TruncatedText } from '../onBoarding/truncatedText';

// Defining the business types and provinces directly in this file (as constants)
const businessTypes = [
  { value: 'cooperative', label: 'Cooperative' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'corporation', label: 'Corporation' },
  { value: 'sole-proprietorship', label: 'Sole Proprietorship' },
  { value: 'limited-liability-company', label: 'Limited Liability Company' },
  { value: 'extra-provincial-corporation', label: 'Extra-Provincial Corporation' },
  { value: 'public-company', label: 'Public Company' },
  { value: 'branch', label: 'Branch' },
  { value: 'subsidiary', label: 'Subsidiary' },
  { value: 'other', label: 'Other' },
];

const canadaProvinceNames = [
  { label: 'Alberta', value: 'AB' },
  { label: 'British Columbia', value: 'BC' },
  { label: 'Manitoba', value: 'MB' },
  { label: 'New Brunswick', value: 'NB' },
  { label: 'Newfoundland & Labrador', value: 'NL' },
  { label: 'Nova Scotia', value: 'NS' },
  { label: 'Northwest Territories', value: 'NT' },
  { label: 'Nunavut', value: 'NU' },
  { label: 'Ontario', value: 'ON' },
  { label: 'Prince Edward Island', value: 'PE' },
  { label: 'Quebec', value: 'QC' },
  { label: 'Saskatchewan', value: 'SK' },
  { label: 'Yukon', value: 'YT' },
];

// Dummy function for fetching NAICS codes
const fetchNaicsCodes = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { label: "Software Development", value: "12345" },
        { label: "Consulting", value: "67890" },
      ]);
    }, 1000);
  });
};

const IndustryDetails = ({ onComplete }) => {
  const theme = useTheme();
  const [codeTree, setCodeTree] = useState([]);
  const [industryCode, setIndustryCode] = useState(null);
  const codesSelected = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [searchableOptions, setSearchableOptions] = useState([]);
  const [showIntermediate, setShowIntermediate] = useState(false);

  const { register, handleSubmit, getValues, resetField } = useForm();

  useEffect(() => {
    fetchNaicsCodes().then((codes) => {
      const formattedCodes = codes.map((code) => ({
        value: code.value,
        label: code.label,
        parent: null,
        children: [],
      }));
      setCodeTree(formattedCodes);
    });
  }, []);

  const codeSelected = (index, value) => {
    const codes = industryCode ? [...industryCode] : [];
    const curValues = getValues();

    if (codes && index < codes.length) {
      codes.splice(index);
      codesSelected.current = codes;
      const keys = Object.keys(curValues);
      for (let i = index + 1; i < keys.length; i++) {
        const key = keys[i];
        resetField(key, { defaultValue: undefined });
      }
    }

    setIndustryCode(codes);
    setInputValue("");
  };

  const handleSubmitForm = (data) => {
    const count = industryCode && industryCode.length;
    if (count >= 3) {
      onComplete(industryCode[2].value);
    }
  };

  const renderCurrentStep = () => {
    const currentStep = industryCode?.length || 0;

    if (currentStep === 2) {
      return (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              mb: 3,
            }}
          >
            {industryCode[1]?.children?.map((option) => (
              <Button
                key={option.value}
                variant="outlined"
                onClick={() => codeSelected(2, option)}
                sx={{
                  p: 2,
                  borderRadius: "8px",
                  textTransform: "none",
                  width: "100%",
                  justifyContent: "flex-start",
                  borderColor:
                    industryCode[2]?.value === option.value
                      ? theme.palette.finroy.blue.main
                      : theme.palette.divider,
                  color:
                    industryCode[2]?.value === option.value
                      ? theme.palette.finroy.blue.main
                      : theme.palette.text.primary,
                  height: "56px",
                  fontSize: "16px",
                  fontWeight: 400,
                }}
              >
                <TruncatedText maxLength={40}>{option.label}</TruncatedText>
              </Button>
            ))}
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography
              variant="body2"
              sx={{ mb: 2, color: theme.palette.text.secondary }}
            >
              Search for other classifications
            </Typography>
            <Autocomplete
              options={searchableOptions}
              getOptionLabel={(option) => option.label || ""}
              value={null}
              inputValue={inputValue}
              onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
              onChange={(_, newValue) => {
                newValue && codeSelected(2, newValue);
              }}
              renderInput={(params) => (
                <TextField {...params} placeholder="Search for other classifications" fullWidth />
              )}
              isOptionEqualToValue={() => true}
              fullWidth
              sx={{ mb: 2 }}
            />
          </Box>
        </>
      );
    }

    return (
      <Box sx={{ mb: 3 }}>
        <Autocomplete
          options={
            !industryCode?.length
              ? codeTree
              : industryCode[industryCode.length - 1]?.children || []
          }
          getOptionLabel={(option) => option.label || ""}
          value={null}
          inputValue={inputValue}
          onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
          onChange={(_, newValue) => {
            newValue && codeSelected(industryCode?.length || 0, newValue);
          }}
          renderInput={(params) => (
            <TextField {...params} placeholder="Select an option" fullWidth />
          )}
          isOptionEqualToValue={() => true}
          fullWidth
        />
      </Box>
    );
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleSubmitForm)} noValidate sx={{ width: "100%" }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ width: "100%", height: 4, bgcolor: theme.palette.grey[100], borderRadius: 2 }}>
          <Box
            sx={{
              width: showIntermediate ? "100%" : `${((industryCode?.length || 0) / 5) * 100}%`,
              height: "100%",
              bgcolor: theme.palette.finroy.blue.main,
              borderRadius: 2,
              transition: "width 0.3s ease",
            }}
          />
        </Box>
      </Box>

      {renderCurrentStep()}

      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 1 }}>
        {industryCode?.map((code, index) => (
          <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body1" color="text.primary">
              {code.label}
            </Typography>
            {index < (industryCode?.length || 0) - 1 && (
              <Typography variant="body1" color="text.secondary" sx={{ mx: 1 }}>
                {">"}
              </Typography>
            )}
          </Box>
        ))}
      </Box>

      <Button
        variant="contained"
        type="submit"
        sx={{
          borderRadius: "8px",
          bgcolor: theme.palette.finroy.blue.main,
          color: "white",
          py: 2,
          "&:hover": {
            bgcolor: theme.palette.finroy.blue[700],
          },
        }}
      >
        {industryCode?.length === 3 ? "Finish Setup" : "Next"}
      </Button>
    </Box>
  );
};

export default IndustryDetails;
