import React, { useState } from 'react';
import { TextField, Button, Stack } from '@mui/material';

interface PrizeFormProps {
  addPrize: (name: string) => void;
}

const PrizeForm: React.FC<PrizeFormProps> = ({ addPrize }) => {
  const [prizeName, setPrizeName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prizeName.trim() === '') return;
    addPrize(prizeName);
    setPrizeName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2} direction="row" justifyContent="center" alignItems="center">
        <TextField
          label="Prize Name"
          variant="outlined"
          value={prizeName}
          onChange={(e) => setPrizeName(e.target.value)}
        />
        <Button type="submit" variant="contained">
          Add Prize
        </Button>
      </Stack>
    </form>
  );
};

export default PrizeForm;
