import React, { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { Editor } from '@tinymce/tinymce-react';

const TinyMCEEditor = ({ control, name, label, rules }) => {


  return (
    <div>
      <label>{label}</label>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <Editor
            id={name}
            value={value}
            onBlur={onBlur}
            
          />
        )}
      />
      <br />
    </div>
  );
};

export default TinyMCEEditor;
