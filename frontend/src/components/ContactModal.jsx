import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

const ContactModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-muted shadow-2xl relative">
        <CardContent className="p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-orange-400"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="mb-6">
              <div className="inline-flex items-center bg-orange-50 border border-orange-400 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <p>Contact Us</p>
              </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Ada Pertanyaan?<br />Kami Siap Membantu
            </h3>
            <p className="text-gray-600 text-sm">
              Tim AdaptLearn dengan senang hati membantu pertanyaanmu. Hubungi kami lewat form di bawah!
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-gray-900 font-bold">Hubungi Kami</h4>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                placeholder="Nama"
                className="text-sm border"
              />
              <Input
                type="email"
                placeholder="Email"
                className="text-sm border"
              />
            </div>
            <textarea
              placeholder="Pesan"
              rows="4"
              className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            ></textarea>
            <Button className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold">
              Kirim Pesan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactModal;
