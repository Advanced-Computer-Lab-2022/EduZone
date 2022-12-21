import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
const SubtitleNote = () => {
  const noteRef: any = useRef();
  const [note, setNote] = useState('');
  return (
    <div>
      <Editor
        onEditorChange={(desc) => setNote(desc)}
        apiKey={import.meta.env.VITE_TINY_API_KEY as string}
        onInit={(evt, editor) => (noteRef.current = editor)}
        initialValue={''}
        init={{
          height: 200,
          menubar: false,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount',
          ],
          toolbar:
            'undo redo | styles| formatselect |' +
            'forecolor bold italic | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | help',
          content_style:
            'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        }}
      />
    </div>
  );
};

/**
 * 
            'undo redo | formatselect |' +
            'forecolor bold italic | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
 */

export default SubtitleNote;
