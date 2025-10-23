import {
  Cpp,
  Css,
  Doc,
  File,
  Jpg,
  Pdf,
  Png,
  Ppt,
  Sql,
  Svg,
  Txt,
  Xls,
  Zip,
} from '@/assets/icons/FileExtensions';
export const getFileIcon = (ext: string) => {
  const extension = ext?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return <Pdf className="w-5 h-5" />;
    case 'doc':
    case 'docx':
      return <Doc className="w-5 h-5" />;
    case 'xls':
    case 'xlsx':
      return <Xls className="w-5 h-5" />;
    case 'sql':
      return <Sql className="w-5 h-5" />;
    case 'ppt':
    case 'pptx':
      return <Ppt className="w-5 h-5" />;
    case 'png':
      return <Png className="w-5 h-5" />;
    case 'jpg':
    case 'jpeg':
      return <Jpg className="w-5 h-5" />;
    case 'svg':
      return <Svg className="w-5 h-5" />;
    case 'txt':
      return <Txt className="w-5 h-5" />;
    case 'zip':
    case 'rar':
      return <Zip className="w-5 h-5" />;
    case 'cpp':
      return <Cpp className="w-5 h-5" />;
    case 'css':
      return <Css className="w-5 h-5" />;
    default:
      return <File className="w-5 h-5" />;
  }
};
