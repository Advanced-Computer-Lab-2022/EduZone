import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { MdCloudUpload } from 'react-icons/md';
import CircularLoadingIndicator from '../../../components/common/CircularLoadingIndicator';

declare type SubtitleNoteProps = {
  initialNote: string;
  onChangeNote: (note: string) => void;
  onSaveNote: () => void;
  saved?: boolean;
};

const SubtitleNote: React.FC<SubtitleNoteProps> = ({
  initialNote,
  onChangeNote,
  onSaveNote,
  saved,
}) => {
  const noteRef: any = useRef();
  const [loading, setLoading] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-between my-2">
        <p className={' text-lg'}>Your Notes</p>
        <div className="flex items-center  gap-3">
          {!saved && <p className="text-gray-500 text-sm">Not Saved</p>}
          <button
            className=" px-4 py-1 text-white bg-primary rounded-md flex items-center gap-2 disabled:opacity-50"
            onClick={async () => {
              setLoading(true);
              await onSaveNote();
              setLoading(false);
            }}
            disabled={saved}
          >
            {loading ? (
              <CircularLoadingIndicator loading={true} />
            ) : (
              <MdCloudUpload />
            )}
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>
      <Editor
        onEditorChange={(note) => onChangeNote(note)}
        apiKey={import.meta.env.VITE_TINY_API_KEY as string}
        onInit={(evt, editor) => (noteRef.current = editor)}
        initialValue={initialNote}
        init={{
          height: 250,
          menubar: false,
          plugins:
            'export pagebreak code emoticons image table lists advlist checklist link charmap directionality',
          toolbar:
            'export  | blocks fontfamily fontsize | forecolor backcolor bold italic underline strikethrough | subscript superscript | alignleft aligncenter alignright alignjustify indent outdent rtl ltr | bullist numlist checklist | link hr charmap',
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
    // plugins: [
  //   'export advlist autolink lists link image charmap print preview anchor',
  //   'searchreplace visualblocks code fullscreen',
  //   'insertdatetime media table paste code help wordcount',
  // ],
  // toolbar:
  //   'export  | blocks fontfamily fontsize | forecolor backcolor bold italic underline strikethrough | backcolor | subscript superscript | alignleft aligncenter alignright alignjustify indent outdent rtl ltr | bullist numlist checklist | emoticons image table link hr charmap',
  // toolbar:
  //   'export | undo redo | styles| formatselect |' +
  //   'forecolor bold italic | alignleft aligncenter ' +
  //   'alignright alignjustify | bullist numlist outdent indent | help',
 */

export default SubtitleNote;
